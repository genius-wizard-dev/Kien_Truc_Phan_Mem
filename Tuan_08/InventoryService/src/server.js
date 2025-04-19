require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const morgan = require("morgan");
const app = express();
connectDB();

app.use(morgan("dev"));
app.use(express.json());

// Import routes
const inventoryRoutes = require("./routes/inventory");
const runKafka = require("./config/kafka.config");
app.use("/api/inventories", inventoryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    runKafka().catch((err) => console.log(err));
    console.log(`🚀 Server running on port ${PORT}`);
});
