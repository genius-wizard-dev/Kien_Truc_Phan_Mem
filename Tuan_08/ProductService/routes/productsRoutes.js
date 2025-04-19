const express = require("express");
const router = express.Router();
const productController = require("../controllers/productsController");

// Create a new product
router.post("/", productController.createProduct);

// Get all products with pagination, filtering, and search
router.get("/", productController.getProducts);

// Get a single product by ID
router.get("/:id", productController.getProductById);

// Update a product
router.put("/:id", productController.updateProduct);

// Delete a product (soft delete)
router.delete("/:id", productController.deleteProduct);

module.exports = router;
