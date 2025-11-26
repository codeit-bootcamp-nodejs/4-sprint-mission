"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const productRepository_1 = require("../repositories/productRepository");
const likeRepository_1 = require("../repositories/likeRepository");
const alertService_1 = require("../services/alertService");
class ProductService {
    constructor() {
        this.repo = new productRepository_1.ProductRepository();
        this.likeRepo = new likeRepository_1.LikeRepository();
        this.alertService = new alertService_1.AlertService();
    }
    async create(userId, data) {
        return this.repo.createProduct({ ...data, userId });
    }
    async list({ page, pageSize, keyword }) {
        const where = keyword
            ? {
                OR: [
                    { name: { contains: keyword, mode: "insensitive" } },
                    { description: { contains: keyword, mode: "insensitive" } },
                ],
            }
            : {};
        return this.repo.findMany(where, (page - 1) * pageSize, pageSize);
    }
    async getDetail(id) {
        return this.repo.findById(id);
    }
    async update(userId, productId, data) {
        const product = await this.repo.findById(productId);
        if (!product)
            throw new Error("NOT_FOUND");
        if (product.userId !== userId)
            throw new Error("FORBIDDEN");
        const oldPrice = product.price;
        const updated = await this.repo.updateProduct(productId, data);
        if (data.price !== undefined && data.price !== oldPrice) {
            const likedUsers = await this.likeRepo.findUsersWhoLikedProduct(productId);
            const targetUsers = likedUsers.filter((u) => u.id !== userId);
            for (const user of targetUsers) {
                await this.alertService.create(user.id, `좋아요한 상품 "${updated.name}"의 가격이 ${oldPrice}원 → ${data.price}원으로 변경되었습니다.`, `/products/${productId}`);
            }
        }
        return updated;
    }
    async delete(userId, productId) {
        const product = await this.repo.findById(productId);
        if (!product)
            throw new Error("NOT_FOUND");
        if (product.userId !== userId)
            throw new Error("FORBIDDEN");
        await this.repo.deleteProduct(productId);
    }
}
exports.ProductService = ProductService;
//# sourceMappingURL=productService.js.map