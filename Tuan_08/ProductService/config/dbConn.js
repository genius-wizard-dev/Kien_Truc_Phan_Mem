const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose
            .connect(process.env.DATABASE_URI)
            .then(() => console.log("Connected to local MongoDB"))
            .catch((err) => console.error("Connection error:", err));
    } catch (error) {
        console.error(error);
    }
};

module.exports = connectDB;
