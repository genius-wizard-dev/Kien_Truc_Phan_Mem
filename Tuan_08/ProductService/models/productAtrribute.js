const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductAttributeTypeSchema = new Schema({
    brand: {
        type: String,
        trim: true,
        default: "No Brand",
    },
    description: {
        type: String,
        trim: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
});

// Factory Pattern
class ProductAttributeFactory {
    static createAttributeSchema(category) {
        switch (category) {
            case "Clothes":
                return new Schema({
                    ...ProductAttributeTypeSchema.obj,
                    material: {
                        type: String, // ["Cotton"]
                    },
                    size: {
                        type: [String], // ["XS", "S", "M", "L", "XL", "XXL"]
                    },
                    color: {
                        type: [String], // ["Black", "White", "Red"]
                    },
                    pattern: {
                        type: [String], // ["Solid", "Striped"]
                    },
                });
            case "Mobile":
                return new Schema({
                    ...ProductAttributeTypeSchema.obj,
                    screenSize: {
                        type: String, // "6.5 inches"
                    },
                    ram: {
                        type: [String], // "[8GB, 16GB]"
                    },
                    storage: {
                        type: [String], // ["64GB", "128GB"]
                    },
                    operatingSystem: {
                        type: String, // "Android", "iOS"
                    },
                    battery: {
                        type: String, // "4000mAh"
                    },
                    camera: {
                        rear: {
                            type: [String], // ["48MP", "12MP"],
                        },
                        front: {
                            type: [String], // ["12MP"]
                        },
                    },
                    color: {
                        type: [String], // ["Red", "Blue", "Black"]
                    },
                });
            case "Electronics":
                return new Schema({
                    ...ProductAttributeTypeSchema.obj,
                    powerConsumption: {
                        type: String, // "50W"
                    },
                    dimensions: {
                        type: String, // "32 x 20 x 5 inches"
                    },
                    connectivity: {
                        type: [String], // ["HDMI", "Bluetooth", "Wi-Fi"]
                    },
                    warranty: {
                        type: String, // "1 year"
                    },
                });
            case "Computer":
                return new Schema({
                    ...ProductAttributeTypeSchema.obj,
                    processor: {
                        type: String, // "Intel i7"
                    },
                    ram: {
                        type: [String], // ["8GB", "16GB"]
                    },
                    storageType: {
                        type: String, // "SSD", "HDD"
                    },
                    operatingSystem: {
                        type: [String], // ["Windows", "MacOS"]
                    },
                });
            case "Camera":
                return new Schema({
                    ...ProductAttributeTypeSchema.obj,
                    resolution: {
                        type: String, // "24MP"
                    },
                    lensType: {
                        type: [String], // ["18-55mm", "50mm"]
                    },
                    sensorType: {
                        type: String, // "APS-C", "Full Frame"
                    },
                    videoResolution: {
                        type: [String], // ["4K", "1080p"]
                    },
                });
            case "Watch":
                return new Schema({
                    ...ProductAttributeTypeSchema.obj,
                    watchType: {
                        type: String, // "Analog", "Smartwatch"
                    },
                    strapMaterial: {
                        type: String, // "Leather", "Silicone"
                    },
                    waterResistance: {
                        type: String, // "50m"
                    },
                    features: {
                        type: [String], // ["Heart Rate Monitor", "Chronograph"]
                    },
                });
            case "Beauty":
                return new Schema({
                    ...ProductAttributeTypeSchema.obj,
                    type: {
                        type: String, // "Lipstick", "Moisturizer"
                    },
                    shade: {
                        type: [String], // ["Red", "Nude"]
                    },
                    skinType: {
                        type: [String], // ["Oily", "Dry"]
                    },
                    expirationDate: {
                        type: Date, // "2026-01-01"
                    },
                });
            case "Health":
                return new Schema({
                    ...ProductAttributeTypeSchema.obj,
                    category: {
                        type: String, // "Vitamin", "Mask"
                    },
                    dosage: {
                        type: String, // "2 tablets daily"
                    },
                    ingredients: {
                        type: [String], // ["Vitamin D", "Zinc"]
                    },
                    expirationDate: {
                        type: Date, // "2026-01-01"
                    },
                });
            case "Grocery":
                return new Schema({
                    ...ProductAttributeTypeSchema.obj,
                    category: {
                        type: String, // "Snacks", "Beverages"
                    },
                    weight: {
                        type: String, // "200g"
                    },
                    nutritionalInfo: {
                        type: String, // "Calories: 150 per serving"
                    },
                    expirationDate: {
                        type: Date, // "2025-12-01"
                    },
                });
            case "Toy":
                return new Schema({
                    ...ProductAttributeTypeSchema.obj,
                    ageRange: {
                        type: String, // "3-5 years"
                    },
                    material: {
                        type: String, // "Plush", "Plastic"
                    },
                    safetyFeatures: {
                        type: [String], // ["Non-Toxic", "No Small Parts"]
                    },
                    type: {
                        type: String, // "Stuffed Toy", "Puzzle"
                    },
                });
            case "MenShoes":
                return new Schema({
                    ...ProductAttributeTypeSchema.obj,
                    material: {
                        type: String, // "Leather", "Canvas"
                    },
                    size: {
                        type: [String], // ["8", "9", "10"]
                    },
                    color: {
                        type: [String], // ["Black", "Brown"]
                    },
                    shoeType: {
                        type: String, // "Sneakers", "Formal"
                    },
                });
            case "WomenShoes":
                return new Schema({
                    ...ProductAttributeTypeSchema.obj,
                    material: {
                        type: String, // "Suede", "Leather"
                    },
                    size: {
                        type: [String], // ["6", "7", "8"]
                    },
                    color: {
                        type: [String], // ["Red", "Nude"]
                    },
                    heelHeight: {
                        type: String, // "3 inches"
                    },
                });
            case "WomenBags":
                return new Schema({
                    ...ProductAttributeTypeSchema.obj,
                    material: {
                        type: String, // "Leather", "Canvas"
                    },
                    size: {
                        type: String, // "Medium", "Large"
                    },
                    color: {
                        type: [String], // ["Black", "Tan"]
                    },
                    bagType: {
                        type: String, // "Tote", "Clutch"
                    },
                });
            case "FashionAccessories":
                return new Schema({
                    ...ProductAttributeTypeSchema.obj,
                    material: {
                        type: String, // "Leather", "Gold"
                    },
                    accessoryType: {
                        type: String, // "Belt", "Necklace"
                    },
                    color: {
                        type: [String], // ["Silver", "Gold"]
                    },
                    size: {
                        type: String, // "Adjustable", "Medium"
                    },
                });
            case "BooksStationery":
                return new Schema({
                    ...ProductAttributeTypeSchema.obj,
                    category: {
                        type: String, // "Book", "Stationery"
                    },
                    genre: {
                        type: String, // "Fiction", "Self-Help" (for books)
                    },
                    author: {
                        type: String, // "J.K. Rowling" (for books)
                    },
                    stationeryType: {
                        type: String, // "Pen", "Notebook" (for stationery)
                    },
                });
            case "MenBags":
                return new Schema({
                    ...ProductAttributeTypeSchema.obj,
                    material: {
                        type: String, // "Nylon", "Leather"
                    },
                    size: {
                        type: String, // "Large", "Medium"
                    },
                    color: {
                        type: [String], // ["Black", "Grey"]
                    },
                    bagType: {
                        type: String, // "Backpack", "Messenger"
                    },
                });
            case "Pet":
                return new Schema({
                    ...ProductAttributeTypeSchema.obj,
                    petType: {
                        type: String, // "Dog", "Cat"
                    },
                    productType: {
                        type: String, // "Food", "Toy"
                    },
                    weight: {
                        type: String, // "1kg"
                    },
                    suitableFor: {
                        type: [String], // ["Puppy", "Adult"]
                    },
                });
            case "ToolsHomeImprovement":
                return new Schema({
                    ...ProductAttributeTypeSchema.obj,
                    toolType: {
                        type: String, // "Drill", "Screwdriver"
                    },
                    material: {
                        type: String, // "Steel", "Plastic"
                    },
                    powerSource: {
                        type: String, // "Battery", "Manual"
                    },
                    usage: {
                        type: [String], // ["Woodworking", "Plumbing"]
                    },
                });
            case "MomsKidsBabies":
                return new Schema({
                    ...ProductAttributeTypeSchema.obj,
                    productType: {
                        type: String, // "Stroller", "Diapers"
                    },
                    ageRange: {
                        type: String, // "0-6 months"
                    },
                    material: {
                        type: String, // "Cotton", "Plastic"
                    },
                    safetyFeatures: {
                        type: [String], // ["BPA-Free", "Non-Slip"]
                    },
                });
            case "HomeLiving":
                return new Schema({
                    ...ProductAttributeTypeSchema.obj,
                    productType: {
                        type: String, // "Cookware", "Decor"
                    },
                    material: {
                        type: String, // "Ceramic", "Wood"
                    },
                    dimensions: {
                        type: String, // "10 x 5 inches"
                    },
                    color: {
                        type: [String], // ["White", "Blue"]
                    },
                });
            case "SportOutdoor":
                return new Schema({
                    ...ProductAttributeTypeSchema.obj,
                    activityType: {
                        type: String, // "Soccer", "Camping"
                    },
                    material: {
                        type: String, // "Rubber", "Nylon"
                    },
                    size: {
                        type: String, // "Standard"
                    },
                    features: {
                        type: [String], // ["Waterproof", "Lightweight"]
                    },
                });
            case "KidFashion":
                return new Schema({
                    ...ProductAttributeTypeSchema.obj,
                    material: {
                        type: String, // "Cotton"
                    },
                    size: {
                        type: [String], // ["XS", "S", "M", "L", "XL", "XXL"]
                    },
                    color: {
                        type: [String], // ["Pink", "Blue"]
                    },
                    ageRange: {
                        type: String, // "2-4 years"
                    },
                });
            case "HomeCare":
                return new Schema({
                    ...ProductAttributeTypeSchema.obj,
                    productType: {
                        type: String, // "Detergent", "Air Freshener"
                    },
                    volume: {
                        type: String, // "1L"
                    },
                    fragrance: {
                        type: String, // "Lavender"
                    },
                    usage: {
                        type: [String], // ["Laundry", "Surface Cleaning"]
                    },
                });
            default:
                throw new Error(`Unknown category: ${category}`);
        }
    }
}

module.exports = ProductAttributeFactory;
