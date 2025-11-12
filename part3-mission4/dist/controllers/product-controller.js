import { productService } from '../services/product-service.js';
class ProductController {
    // 상품
    async getAllProducts(req, res) {
        const userId = req.user?.id || null;
        const { data, pagination } = await productService.getAllProducts(req.query, userId);
        res.json({ data, pagination });
    }
    async getProductById(req, res) {
        const idParam = req.params.id;
        const id = parseInt(idParam, 10);
        const userId = req.user?.id;
        const product = await productService.getProductById(id, userId);
        res.json(product);
    }
    async createProduct(req, res) {
        const { name, description, price, tags } = req.body;
        const newProduct = await productService.createProduct(req.user.id, name, description, price, tags);
        res.status(201).json(newProduct);
    }
    async updateProduct(req, res) {
        const idParam = req.params.id;
        const id = parseInt(idParam, 10);
        const { name, description, price, tags, images } = req.body;
        const updateData = { name, description, price, tags, images };
        const updated = await productService.updateProduct(id, req.user.id, updateData);
        res.json(updated);
    }
    async deleteProduct(req, res) {
        const idParam = req.params.id;
        const id = parseInt(idParam, 10);
        await productService.deleteProduct(id, req.user.id);
        res.status(204).send();
    }
    async likeProduct(req, res) {
        const userId = req.user.id;
        const idParam = req.params.id;
        const productId = parseInt(idParam, 10);
        const product = await productService.productLike(userId, productId);
        res.json({ data: product });
    }
    async unlikeProduct(req, res) {
        const userId = req.user.id;
        const idParam = req.params.id;
        const productId = parseInt(idParam, 10);
        const product = await productService.productUnlike(userId, productId);
        res.json({ data: product });
    }
    // 본인이 등록한 상품 조회
    async getUserProducts(req, res) {
        const userId = req.user.id;
        const products = await productService.getUserProducts(userId);
        res.status(200).json({ products });
    }
}
export const productController = new ProductController();
//# sourceMappingURL=product-controller.js.map