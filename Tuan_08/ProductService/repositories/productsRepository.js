const Product = require("../models/product");

class ProductRepository {
    async create(productData) {
        const product = new Product(productData);
        return await product.save();
    }

    async findAll({ page, limit, category }) {
        const query = { isActive: true };
        if (category) query.category = category;

        const products = await Product.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ count: -1 });

        const total = await Product.countDocuments(query);
        return { products, total, page, pages: Math.ceil(total / limit) };
    }

    async findById(id) {
        return await Product.findById(id).where({ isActive: true });
    }

    async update(id, updateData) {
        const product = await Product.findById(id);
        if (!product) {
            return { error: 404, message: "Product not found" };
        }
        if (updateData.category && updateData.category !== product.category) {
            return { error: 400, message: "Category mismatch" };
        }
        if (updateData.attribute) {
            updateData.attribute = {
                ...product.attribute,
                ...updateData.attribute,
            };
        }
        return await Product.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );
    }

    async delete(id) {
        return await Product.findByIdAndUpdate(
            id,
            { $set: { isActive: false } },
            { new: true }
        );
    }
}

module.exports = new ProductRepository(); // Singleton instance
