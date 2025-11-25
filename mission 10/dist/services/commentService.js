"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const commentRepository_1 = require("../repositories/commentRepository");
const articleRepository_1 = require("../repositories/articleRepository");
const productRepository_1 = require("../repositories/productRepository");
const alertService_1 = require("../services/alertService");
class CommentService {
    constructor() {
        this.repo = new commentRepository_1.CommentRepository();
        this.articleRepo = new articleRepository_1.ArticleRepository();
        this.productRepo = new productRepository_1.ProductRepository();
        this.alertService = new alertService_1.AlertService();
    }
    async createArticleComment(userId, articleId, content) {
        const article = await this.articleRepo.findById(articleId);
        if (!article) {
            throw new Error("Article not found");
        }
        const comment = await this.repo.createArticleComment(userId, articleId, content);
        if (article && article.userId !== userId) {
            await this.alertService.create(article.userId, "내 게시글에 새로운 댓글이 달렸습니다.", `/articles/${articleId}`);
        }
        return comment;
    }
    async createProductComment(userId, productId, content) {
        const product = await this.productRepo.findById(productId);
        if (!product) {
            throw new Error("Product not found");
        }
        const comment = await this.repo.createProductComment(userId, productId, content);
        if (product && product.userId !== userId) {
            await this.alertService.create(product.userId, "내 판매글에 새로운 댓글이 달렸습니다.", `/products/${productId}`);
        }
        return comment;
    }
    async updateComment(userId, commentId, content) {
        const comment = await this.repo.findById(commentId);
        if (!comment)
            throw new Error("NOT_FOUND");
        if (comment.userId !== userId)
            throw new Error("FORBIDDEN");
        return this.repo.updateComment(commentId, content);
    }
    async deleteComment(userId, commentId) {
        const comment = await this.repo.findById(commentId);
        if (!comment)
            throw new Error("NOT_FOUND");
        if (comment.userId !== userId)
            throw new Error("FORBIDDEN");
        await this.repo.deleteComment(commentId);
    }
    async getProductComments(productId, lastId) {
        return this.repo.findProductComments(productId, lastId);
    }
    async getArticleComments(articleId, lastId) {
        return this.repo.findArticleComments(articleId, lastId);
    }
}
exports.CommentService = CommentService;
//# sourceMappingURL=commentService.js.map