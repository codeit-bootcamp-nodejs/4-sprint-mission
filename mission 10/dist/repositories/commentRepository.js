"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRepository = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
class CommentRepository {
    async createProductComment(userId, productId, content) {
        return prisma_1.default.comment.create({
            data: { content, productId, articleId: null, userId },
        });
    }
    async createArticleComment(userId, articleId, content) {
        return prisma_1.default.comment.create({
            data: { content, productId: null, articleId, userId },
        });
    }
    async findById(commentId) {
        return prisma_1.default.comment.findUnique({ where: { id: commentId } });
    }
    async updateComment(commentId, content) {
        return prisma_1.default.comment.update({
            where: { id: commentId },
            data: { content },
        });
    }
    async deleteComment(commentId) {
        return prisma_1.default.comment.delete({ where: { id: commentId } });
    }
    async findProductComments(productId, lastId) {
        return prisma_1.default.comment.findMany({
            where: { articleId: null, productId },
            take: 5,
            skip: lastId ? 1 : 0,
            ...(lastId && { cursor: { id: lastId } }),
            select: { id: true, content: true, createdAt: true },
        });
    }
    async findArticleComments(articleId, lastId) {
        return prisma_1.default.comment.findMany({
            where: { articleId, productId: null },
            take: 5,
            skip: lastId ? 1 : 0,
            ...(lastId && { cursor: { id: lastId } }),
            select: { id: true, content: true, createdAt: true },
        });
    }
}
exports.CommentRepository = CommentRepository;
exports.default = new CommentRepository();
//# sourceMappingURL=commentRepository.js.map