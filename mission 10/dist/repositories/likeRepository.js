"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeRepository = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
class LikeRepository {
    async findArticle(articleId) {
        return prisma_1.default.article.findUnique({ where: { id: articleId } });
    }
    async findProduct(productId) {
        return prisma_1.default.product.findUnique({ where: { id: productId } });
    }
    async findArticleLike(userId, articleId) {
        return prisma_1.default.like.findUnique({
            where: { userId_articleId: { userId, articleId } },
        });
    }
    async findProductLike(userId, productId) {
        return prisma_1.default.like.findUnique({
            where: { userId_productId: { userId, productId } },
        });
    }
    async toggleArticleLike(userId, articleId, current) {
        return prisma_1.default.like.update({
            where: { userId_articleId: { userId, articleId } },
            data: { like: !current },
        });
    }
    async toggleProductLike(userId, productId, current) {
        return prisma_1.default.like.update({
            where: { userId_productId: { userId, productId } },
            data: { like: !current },
        });
    }
    async createArticleLike(userId, articleId) {
        return prisma_1.default.like.create({
            data: { like: true, userId, articleId },
        });
    }
    async createProductLike(userId, productId) {
        return prisma_1.default.like.create({
            data: { like: true, userId, productId },
        });
    }
    async findLikedArticles(userId) {
        return prisma_1.default.like.findMany({
            where: { userId, articleId: { not: null }, like: true },
            include: {
                article: { select: { id: true, title: true } },
            },
        });
    }
    async findLikedProducts(userId) {
        return prisma_1.default.like.findMany({
            where: { userId, productId: { not: null }, like: true },
            include: {
                product: { select: { id: true, name: true, price: true, tags: true } },
            },
        });
    }
    async findUsersWhoLikedProduct(productId) {
        const likes = await prisma_1.default.like.findMany({
            where: {
                productId,
                like: true,
            },
            select: {
                user: {
                    select: {
                        id: true,
                        nickname: true,
                    },
                },
            },
        });
        return likes.map((like) => like.user);
    }
}
exports.LikeRepository = LikeRepository;
//# sourceMappingURL=likeRepository.js.map