"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeService = void 0;
const likeRepository_1 = require("../repositories/likeRepository");
class LikeService {
    constructor() {
        this.repo = new likeRepository_1.LikeRepository();
    }
    async likeArticle(userId, articleId) {
        const article = await this.repo.findArticle(articleId);
        if (!article)
            throw new Error("ARTICLE_NOT_FOUND");
        const existing = await this.repo.findArticleLike(userId, articleId);
        if (existing) {
            return this.repo.toggleArticleLike(userId, articleId, existing.like);
        }
        return this.repo.createArticleLike(userId, articleId);
    }
    async likeProduct(userId, productId) {
        const product = await this.repo.findProduct(productId);
        if (!product)
            throw new Error("PRODUCT_NOT_FOUND");
        const existing = await this.repo.findProductLike(userId, productId);
        if (existing) {
            return this.repo.toggleProductLike(userId, productId, existing.like);
        }
        return this.repo.createProductLike(userId, productId);
    }
    async getLikedArticles(userId) {
        return this.repo.findLikedArticles(userId);
    }
    async getLikedProducts(userId) {
        return this.repo.findLikedProducts(userId);
    }
}
exports.LikeService = LikeService;
//# sourceMappingURL=likeService.js.map