const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema(
    {
        shop_id: { type: String, required: true },
        product_name: { type: String, required: true },
        product_id: { type: String, required: true },
        total_quantity: { type: Number, required: true, default: 0 },
        reserved_quantity: { type: Number, required: true, default: 0 }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Inventory", InventorySchema);
