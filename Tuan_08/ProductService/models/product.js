const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProductAttributeFactory = require("./productAtrribute");

// Validation Strategy Interface
class ValidationStrategy {
    validate(attribute, schema) {
        throw new Error("Method not implemented");
    }
}

// Default Validation Strategy
class DefaultValidationStrategy extends ValidationStrategy {
    validate(attribute, schema) {
        const errors = [];

        Object.keys(schema.paths).forEach((path) => {
            // Skip Mongoose internal fields
            if (path === "__v" || path === "_id") return;

            const schemaType = schema.paths[path];
            const value = attribute[path];

            // Check if required field is missing
            if (value === undefined) {
                if (schemaType.isRequired) {
                    errors.push(`${path} is required`);
                }
                return;
            }

            // Type checking
            if (schemaType.instance === "String" && typeof value !== "string") {
                errors.push(
                    `${path} must be a string, received ${typeof value}`
                );
            } else if (
                schemaType.instance === "Number" &&
                typeof value !== "number"
            ) {
                errors.push(
                    `${path} must be a number, received ${typeof value}`
                );
            } else if (
                schemaType.instance === "Boolean" &&
                typeof value !== "boolean"
            ) {
                errors.push(
                    `${path} must be a boolean, received ${typeof value}`
                );
            } else if (
                schemaType.instance === "Date" &&
                !(value instanceof Date) &&
                !this.isValidDateString(value)
            ) {
                errors.push(
                    `${path} must be a valid date, received ${typeof value}`
                );
            } else if (
                schemaType.instance === "Array" &&
                !Array.isArray(value)
            ) {
                errors.push(
                    `${path} must be an array, received ${typeof value}`
                );
            }

            // Apply additional validators if present
            if (schemaType.validators && schemaType.validators.length > 0) {
                try {
                    const castedValue = schemaType.cast(value);
                    for (const validator of schemaType.validators) {
                        if (!validator.validator(castedValue)) {
                            errors.push(validator.message);
                            break;
                        }
                    }
                } catch (error) {
                    errors.push(`Invalid ${path}: ${error.message}`);
                }
            }
        });

        return errors.length > 0 ? errors : null;
    }

    isValidDateString(dateString) {
        if (typeof dateString !== "string") return false;
        const date = new Date(dateString);
        return !isNaN(date.getTime());
    }
}

// Product Schema Definition
const productSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
            minlength: [3, "Product name must be at least 3 characters"],
            maxlength: [100, "Product name cannot exceed 100 characters"],
        },
        description: {
            type: String,
            required: [true, "Product description is required"],
            minlength: [10, "Description must be at least 10 characters"],
            maxlength: [2000, "Description cannot exceed 2000 characters"],
        },
        price: {
            type: Number,
            required: [true, "Product price is required"],
            min: [0.01, "Price must be greater than 0"],
        },
        category: {
            type: String,
            required: true,
            enum: [
                "Clothes",
                "Mobile",
                "Electronics",
                "Computer",
                "Camera",
                "Watch",
                "Beauty",
                "Health",
                "Grocery",
                "Toy",
                "MenShoes",
                "WomenShoes",
                "WomenBags",
                "FashionAccessories",
                "BooksStationery",
                "MenBags",
                "Pet",
                "ToolsHomeImprovement",
                "MomsKidsBabies",
                "HomeLiving",
                "SportOutdoor",
                "KidFashion",
                "HomeCare",
            ],
        },
        attribute: {
            type: Schema.Types.Mixed,
            required: [true, "Product attributes are required"],
        },
        images: [String],
        thumbnailImage: {
            type: String,
        },
        ratings: {
            average: {
                type: Number,
                default: 0,
                min: 0,
                max: 5,
            },
            count: {
                type: Number,
                default: 0,
            },
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        tags: [String],
    },
    { timestamps: true }
);

// Pre-save Hook with Validation Strategy
productSchema.pre("save", function (next) {
    // Ensure attribute is a non-null object
    if (
        typeof this.attribute !== "object" ||
        Array.isArray(this.attribute) ||
        this.attribute === null
    ) {
        return next(new Error("Product attributes must be a non-null object."));
    }

    // Get the schema for the category using the factory
    let attributeSchema;
    try {
        attributeSchema = ProductAttributeFactory.createAttributeSchema(
            this.category
        );
    } catch (error) {
        return next(new Error(`Invalid category: ${this.category}`));
    }

    // Apply validation strategy
    const validator = new DefaultValidationStrategy();
    const errors = validator.validate(this.attribute, attributeSchema);

    if (errors) {
        return next(new Error(`Validation errors: ${errors.join(", ")}`));
    }

    next();
});

// Pre-findOneAndUpdate Hook with Validation Strategy
productSchema.pre("findOneAndUpdate", async function (next) {
    const update = this.getUpdate();
    const query = this._conditions;

    // Determine the category
    let category = update.$set?.category || query.category;
    if (!category) {
        const existingProduct = await this.model
            .findOne(query)
            .select("category");
        if (!existingProduct) {
            return next(new Error("Product not found"));
        }
        category = existingProduct.category;
    }

    // Validate attributes if being updated
    if (update.$set && update.$set.attribute) {
        const attribute = update.$set.attribute;

        // Ensure attribute is a non-null object
        if (
            typeof attribute !== "object" ||
            Array.isArray(attribute) ||
            attribute === null
        ) {
            return next(
                new Error("Product attributes must be a non-null object.")
            );
        }

        // Get the schema for the category
        let attributeSchema;
        try {
            attributeSchema =
                ProductAttributeFactory.createAttributeSchema(category);
        } catch (error) {
            return next(new Error(`Invalid category: ${category}`));
        }

        // Apply validation strategy
        const validator = new DefaultValidationStrategy();
        const errors = validator.validate(attribute, attributeSchema);

        if (errors) {
            return next(new Error(`Validation errors: ${errors.join(", ")}`));
        }
    }

    next();
});

// Indexes for improved query performance
productSchema.index({ name: "text", description: "text" });
productSchema.index({ category: 1 });

// Export the Product model as a singleton
module.exports = mongoose.model("Product", productSchema);
