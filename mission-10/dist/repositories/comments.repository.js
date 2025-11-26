import { prisma } from '../utils/prisma.util.js';
export class CommentsRepository {
    constructor() {
        this.findArticleById = async (articleId) => {
            return prisma.article.findUnique({ where: { id: articleId } });
        };
        this.createArticleComment = async (userId, articleId, content) => {
            return prisma.comment.create({
                data: {
                    content,
                    authorId: userId,
                    articleId: articleId,
                },
            });
        };
        this.findProductById = async (productId) => {
            return prisma.product.findUnique({ where: { id: productId } });
        };
        this.createProductComment = async (userId, productId, content) => {
            return prisma.comment.create({
                data: {
                    content,
                    authorId: userId,
                    productId: productId,
                },
            });
        };
        this.findCommentsByArticleId = async (articleId) => {
            return prisma.comment.findMany({
                where: { articleId },
                orderBy: { createdAt: 'desc' },
                select: { id: true, content: true, createdAt: true, updatedAt: true, author: { select: { nickname: true } } },
            });
        };
        this.findCommentsByProductId = async (productId) => {
            return prisma.comment.findMany({
                where: { productId },
                orderBy: { createdAt: 'desc' },
                select: { id: true, content: true, createdAt: true, updatedAt: true, author: { select: { nickname: true } } },
            });
        };
        this.findCommentById = async (commentId) => {
            return prisma.comment.findUnique({ where: { id: commentId } });
        };
        this.updateComment = async (commentId, content) => {
            return prisma.comment.update({
                where: { id: commentId },
                data: { content },
            });
        };
        this.deleteComment = async (commentId) => {
            return prisma.comment.delete({ where: { id: commentId } });
        };
    }
}
