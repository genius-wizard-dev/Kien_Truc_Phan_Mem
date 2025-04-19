require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const corsOptions = require("./config/corsOptions");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const productRoutes = require("./routes/productsRoutes");
const { connectProducer } = require("./kafka/producer");
const PORT = process.env.PORT || 3500;

// connect to mongoDB
connectDB();

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: true }));

// built-in middleware for json
app.use(express.json());

// HTTP request logger middleware for node.js, logs requests to the console in 'dev' format
app.use(morgan("dev"));

// Middleware to secure Express apps by setting various HTTP headers (e.g., XSS protection, HSTS)
app.use(helmet());

//middleware for cookies
app.use(cookieParser());

// routes
// app.use("/", require("./routes/root"));
app.use("/api/products", productRoutes);

app.all("*", (req, res) => {
    res.json({ error: "404 Not Found" });
});

mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    connectProducer().then(() => console.log("Kafka Producer connected"));
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
