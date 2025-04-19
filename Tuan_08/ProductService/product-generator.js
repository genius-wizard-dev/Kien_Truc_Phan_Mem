const fs = require("fs");
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");

// Connect to MongoDB - replace with your connection string
mongoose
    .connect("mongodb://localhost:27017/ecommerce", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

// Import the Product model
const Product = require("./models/product"); // Ensure this path matches your project

// Helper function to generate random items from an array
const getRandomItems = (array, min = 1, max = 3) => {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

// Helper function to generate a random future date
const getRandomFutureDate = (years = 2) => {
    const future = new Date();
    future.setFullYear(future.getFullYear() + Math.random() * years);
    return future;
};

// Helper function to generate category-specific images
const getCategoryImageUrl = (category) => {
    const imageCategories = {
        Clothes: "fashion",
        Mobile: "smartphone",
        Electronics: "electronics",
        Computer: "laptop",
        Camera: "camera",
        Watch: "watch",
        Beauty: "cosmetics",
        Health: "health",
        Grocery: "food",
        Toy: "toy",
        MenShoes: "shoes",
        WomenShoes: "shoes",
        WomenBags: "handbag",
        FashionAccessories: "accessory",
        BooksStationery: "book",
        MenBags: "backpack",
        Pet: "pet",
        ToolsHomeImprovement: "tool",
        MomsKidsBabies: "baby",
        HomeLiving: "furniture",
        SportOutdoor: "sports",
        KidFashion: "fashion",
        HomeCare: "cleaning",
    };
    return faker.image.urlLoremFlickr({
        width: 640,
        height: 480,
        category: imageCategories[category] || "product",
    });
};

// Generate attributes based on category with schema-aligned data
const generateAttributeForCategory = (category) => {
    const baseAttribute = {
        brand: faker.company.name(),
        description: faker.lorem.sentence(),
        isActive: true,
    };

    switch (category) {
        case "Clothes":
            return {
                ...baseAttribute,
                material: faker.commerce.productMaterial(),
                size: getRandomItems(["XS", "S", "M", "L", "XL", "XXL"]),
                color: getRandomItems([
                    "Black",
                    "White",
                    "Red",
                    "Blue",
                    "Green",
                ]),
                pattern: getRandomItems(["Solid", "Striped", "Polka Dot"]),
            };
        case "Mobile":
            return {
                ...baseAttribute,
                screenSize: `${(4.5 + Math.random() * 2.5).toFixed(1)} inches`,
                ram: getRandomItems(["4GB", "8GB", "16GB"]),
                storage: getRandomItems(["64GB", "128GB", "256GB"]),
                operatingSystem: faker.helpers.arrayElement(["Android", "iOS"]),
                battery: `${Math.floor(Math.random() * 3000) + 3000}mAh`,
                camera: {
                    rear: getRandomItems(["12MP", "48MP", "64MP"]),
                    front: getRandomItems(["8MP", "12MP", "20MP"]),
                },
                color: getRandomItems(["Black", "Silver", "Blue"]),
            };
        case "Electronics":
            return {
                ...baseAttribute,
                powerConsumption: `${Math.floor(Math.random() * 100) + 10}W`,
                dimensions: `${Math.floor(Math.random() * 30) + 10} x ${
                    Math.floor(Math.random() * 20) + 5
                } x ${Math.floor(Math.random() * 10) + 1} inches`,
                connectivity: getRandomItems(["HDMI", "Bluetooth", "Wi-Fi"]),
                warranty: `${Math.ceil(Math.random() * 3)} year`,
            };
        case "Computer":
            return {
                ...baseAttribute,
                processor: faker.helpers.arrayElement([
                    "Intel i5",
                    "Intel i7",
                    "AMD Ryzen 5",
                ]),
                ram: getRandomItems(["8GB", "16GB", "32GB"]),
                storageType: faker.helpers.arrayElement(["SSD", "HDD"]),
                operatingSystem: getRandomItems(["Windows", "MacOS"]),
            };
        case "Camera":
            return {
                ...baseAttribute,
                resolution: `${Math.floor(Math.random() * 36) + 12}MP`,
                lensType: getRandomItems(["18-55mm", "50mm"]),
                sensorType: faker.helpers.arrayElement(["APS-C", "Full Frame"]),
                videoResolution: getRandomItems(["1080p", "4K"]),
            };
        case "Watch":
            return {
                ...baseAttribute,
                watchType: faker.helpers.arrayElement(["Analog", "Smartwatch"]),
                strapMaterial: faker.helpers.arrayElement([
                    "Leather",
                    "Silicone",
                ]),
                waterResistance: `${Math.floor(Math.random() * 150) + 30}m`,
                features: getRandomItems(["Heart Rate Monitor", "GPS"]),
            };
        case "Beauty":
            return {
                ...baseAttribute,
                type: faker.helpers.arrayElement(["Lipstick", "Moisturizer"]),
                shade: getRandomItems(["Red", "Nude"]),
                skinType: getRandomItems(["Oily", "Dry"]),
                expirationDate: getRandomFutureDate(),
            };
        case "Health":
            return {
                ...baseAttribute,
                category: faker.helpers.arrayElement(["Vitamin", "Mask"]),
                dosage: `${Math.ceil(Math.random() * 2)} tablets daily`,
                ingredients: getRandomItems(["Vitamin C", "Zinc"]),
                expirationDate: getRandomFutureDate(),
            };
        case "Grocery":
            return {
                ...baseAttribute,
                category: faker.helpers.arrayElement(["Snacks", "Beverages"]),
                weight: `${(Math.random() * 2 + 0.1).toFixed(1)}kg`,
                nutritionalInfo: `Calories: ${Math.floor(
                    Math.random() * 300
                )} per serving`,
                expirationDate: getRandomFutureDate(1),
            };
        case "Toy":
            return {
                ...baseAttribute,
                ageRange: `${Math.floor(Math.random() * 10)}-${
                    Math.floor(Math.random() * 10) + 3
                } years`,
                material: faker.helpers.arrayElement(["Plush", "Plastic"]),
                safetyFeatures: getRandomItems(["Non-Toxic", "No Small Parts"]),
                type: faker.helpers.arrayElement(["Stuffed Toy", "Puzzle"]),
            };
        case "MenShoes":
            return {
                ...baseAttribute,
                material: faker.helpers.arrayElement(["Leather", "Canvas"]),
                size: getRandomItems(["8", "9", "10", "11"]),
                color: getRandomItems(["Black", "Brown"]),
                shoeType: faker.helpers.arrayElement(["Sneakers", "Formal"]),
            };
        case "WomenShoes":
            return {
                ...baseAttribute,
                material: faker.helpers.arrayElement(["Suede", "Leather"]),
                size: getRandomItems(["6", "7", "8"]),
                color: getRandomItems(["Red", "Nude"]),
                heelHeight: `${Math.floor(Math.random() * 4)} inches`,
            };
        case "WomenBags":
            return {
                ...baseAttribute,
                material: faker.helpers.arrayElement(["Leather", "Canvas"]),
                size: faker.helpers.arrayElement(["Medium", "Large"]),
                color: getRandomItems(["Black", "Tan"]),
                bagType: faker.helpers.arrayElement(["Tote", "Clutch"]),
            };
        case "FashionAccessories":
            return {
                ...baseAttribute,
                material: faker.helpers.arrayElement(["Leather", "Gold"]),
                accessoryType: faker.helpers.arrayElement(["Belt", "Necklace"]),
                color: getRandomItems(["Silver", "Gold"]),
                size: faker.helpers.arrayElement(["Adjustable", "Medium"]),
            };
        case "BooksStationery":
            return {
                ...baseAttribute,
                category: faker.helpers.arrayElement(["Book", "Stationery"]),
                genre: category === "Book" ? faker.music.genre() : undefined,
                author:
                    category === "Book" ? faker.person.fullName() : undefined,
                stationeryType:
                    category === "Stationery"
                        ? faker.helpers.arrayElement(["Pen", "Notebook"])
                        : undefined,
            };
        case "MenBags":
            return {
                ...baseAttribute,
                material: faker.helpers.arrayElement(["Nylon", "Leather"]),
                size: faker.helpers.arrayElement(["Large", "Medium"]),
                color: getRandomItems(["Black", "Grey"]),
                bagType: faker.helpers.arrayElement(["Backpack", "Messenger"]),
            };
        case "Pet":
            return {
                ...baseAttribute,
                petType: faker.helpers.arrayElement(["Dog", "Cat"]),
                productType: faker.helpers.arrayElement(["Food", "Toy"]),
                weight: `${(Math.random() * 5 + 0.5).toFixed(1)}kg`,
                suitableFor: getRandomItems(["Puppy", "Adult"]),
            };
        case "ToolsHomeImprovement":
            return {
                ...baseAttribute,
                toolType: faker.helpers.arrayElement(["Drill", "Screwdriver"]),
                material: faker.helpers.arrayElement(["Steel", "Plastic"]),
                powerSource: faker.helpers.arrayElement(["Battery", "Manual"]),
                usage: getRandomItems(["Woodworking", "Plumbing"]),
            };
        case "MomsKidsBabies":
            return {
                ...baseAttribute,
                productType: faker.helpers.arrayElement([
                    "Stroller",
                    "Diapers",
                ]),
                ageRange: `${Math.floor(Math.random() * 5)}-${
                    Math.floor(Math.random() * 5) + 1
                } years`,
                material: faker.helpers.arrayElement(["Cotton", "Plastic"]),
                safetyFeatures: getRandomItems(["BPA-Free", "Non-Slip"]),
            };
        case "HomeLiving":
            return {
                ...baseAttribute,
                productType: faker.helpers.arrayElement(["Cookware", "Decor"]),
                material: faker.helpers.arrayElement(["Ceramic", "Wood"]),
                dimensions: `${Math.floor(Math.random() * 20) + 5} x ${
                    Math.floor(Math.random() * 15) + 5
                } inches`,
                color: getRandomItems(["White", "Blue"]),
            };
        case "SportOutdoor":
            return {
                ...baseAttribute,
                activityType: faker.helpers.arrayElement(["Soccer", "Camping"]),
                material: faker.helpers.arrayElement(["Rubber", "Nylon"]),
                size: faker.helpers.arrayElement(["Standard"]),
                features: getRandomItems(["Waterproof", "Lightweight"]),
            };
        case "KidFashion":
            return {
                ...baseAttribute,
                material: faker.helpers.arrayElement(["Cotton"]),
                size: getRandomItems(["XS", "S", "M", "L"]),
                color: getRandomItems(["Pink", "Blue"]),
                ageRange: `${Math.floor(Math.random() * 10)}-${
                    Math.floor(Math.random() * 5) + 2
                } years`,
            };
        case "HomeCare":
            return {
                ...baseAttribute,
                productType: faker.helpers.arrayElement([
                    "Detergent",
                    "Air Freshener",
                ]),
                volume: `${(Math.random() * 4 + 1).toFixed(1)}L`,
                fragrance: faker.helpers.arrayElement(["Lavender", "Citrus"]),
                usage: getRandomItems(["Laundry", "Surface Cleaning"]),
            };
        default:
            return baseAttribute;
    }
};

// Generate products by category
const generateProducts = async (count = 500) => {
    const productCategories = [
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
    ];

    const products = [];
    const productsPerCategory = Math.ceil(count / productCategories.length);

    for (const category of productCategories) {
        const categoryCount = Math.min(
            productsPerCategory,
            count - products.length
        );
        console.log(
            `Generating ${categoryCount} products for ${category} category...`
        );

        for (let i = 0; i < categoryCount; i++) {
            const product = {
                name: faker.commerce.productName(),
                description: faker.lorem.paragraph(),
                price: parseFloat(faker.commerce.price(5, 2000)),
                category,
                attribute: generateAttributeForCategory(category),
                images: Array(Math.floor(Math.random() * 3) + 1)
                    .fill()
                    .map(() => getCategoryImageUrl(category)),
                thumbnailImage: getCategoryImageUrl(category),
                ratings: {
                    average: parseFloat((Math.random() * 5).toFixed(1)),
                    count: Math.floor(Math.random() * 100),
                },
                isActive: Math.random() > 0.1, // 90% active
                tags: getRandomItems([
                    "new",
                    "sale",
                    "popular",
                    "limited",
                    "trending",
                ]),
            };

            products.push(product);
        }
    }

    return products;
};

// Main function to execute
const generateAndSaveProducts = async () => {
    try {
        console.log("Starting product generation...");
        const products = await generateProducts(500);

        // Save to database in batches to avoid overwhelming MongoDB
        const batchSize = 50;
        for (let i = 0; i < products.length; i += batchSize) {
            const batch = products.slice(i, i + batchSize);
            await Product.insertMany(batch);
            console.log(
                `Inserted batch ${i / batchSize + 1} of ${Math.ceil(
                    products.length / batchSize
                )}`
            );
        }
        console.log(
            `Successfully inserted ${products.length} products into the database.`
        );

        // Save to a JSON file for backup
        fs.writeFileSync(
            "generated_products.json",
            JSON.stringify(products, null, 2)
        );
        console.log("Generated products saved to generated_products.json");

        await mongoose.disconnect();
        console.log("Disconnected from MongoDB.");
    } catch (error) {
        console.error("Error generating or saving products:", error);
        await mongoose.disconnect();
        process.exit(1);
    }
};

// Run the script
generateAndSaveProducts();
