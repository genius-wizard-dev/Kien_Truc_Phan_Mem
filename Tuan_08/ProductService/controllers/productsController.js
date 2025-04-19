const productRepository = require("../repositories/productsRepository");

class ResponseAdapter {
    static success(res, status, data, message = "Success") {
        return res.status(status).json({ success: true, data, message });
    }

    static error(res, status, message) {
        return res.status(status).json({ success: false, message });
    }
}

const productController = {
    async createProduct(req, res) {
        try {
            const product = await productRepository.create(req.body);
            console.log(product);
            ResponseAdapter.success(res, 201, product, "Product created");
        } catch (error) {
            ResponseAdapter.error(res, 400, error.message);
        }
    },

    async getProducts(req, res) {
        try {
            const { page = 1, limit = 10, category } = req.query;
            const products = await productRepository.findAll({
                page: parseInt(page),
                limit: parseInt(limit),
                category
            });
            ResponseAdapter.success(res, 200, products);
        } catch (error) {
            ResponseAdapter.error(res, 400, error.message);
        }
    },

    async getProductById(req, res) {
        try {
            const product = await productRepository.findById(req.params.id);
            if (!product) return ResponseAdapter.error(res, 404, "Product not found");
            ResponseAdapter.success(res, 200, product);
        } catch (error) {
            ResponseAdapter.error(res, 400, error.message);
        }
    },

    async updateProduct(req, res) {
        try {
            const product = await productRepository.update(req.params.id, req.body);
            if (product.error) return ResponseAdapter.error(res, product.error, product.message);
            ResponseAdapter.success(res, 200, product);
        } catch (error) {
            ResponseAdapter.error(res, 400, error.message);
        }
    },

    async deleteProduct(req, res) {
        try {
            const product = await productRepository.delete(req.params.id);
            if (!product) return ResponseAdapter.error(res, 404, "Product not found");
            ResponseAdapter.success(res, 200, null, "Product deleted successfully");
        } catch (error) {
            ResponseAdapter.error(res, 400, error.message);
        }
    }
};

module.exports = productController;
