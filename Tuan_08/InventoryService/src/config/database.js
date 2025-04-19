const mongoose = require("mongoose");
require("dotenv").config();
const { MONGO_URI, MONGO_USER, MONGO_PASS, MONGO_HOST, MONGO_PORT, MONGO_DB } = process.env;

const connectDB = async () => {
    const uri =
        MONGO_URI || `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

    try {
        await mongoose.connect(uri);
        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
