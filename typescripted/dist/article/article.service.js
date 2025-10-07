"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleService = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const error_1 = __importDefault(require("../lib/error"));
class ArticleService {
    async getArticleList({ take, skip, keyword, }) {
        const whereCondition = keyword
            ? {
                OR: [
                    { title: { contains: keyword } },
                    { content: { contains: keyword } },
                ],
            }
            : {};
        const Articles = await prisma_1.default.article.findMany({
            where: whereCondition,
            orderBy: { createdAt: "desc" },
            take,
            skip,
            select: { title: true, content: true }, // 필요한 필드만
        });
        return Articles;
    }
    async getArticle(input) {
        const { articleId } = input;
        const article = await prisma_1.default.article.findUnique({
            where: { id: articleId },
            include: {
                comments: true,
                owner: { select: { id: true } },
            },
        });
        if (!article)
            throw new error_1.default(404, "Article not found");
        return article;
    }
    async createArticle({ title, content, ownerId, }) {
        const result = await prisma_1.default.article.create({
            data: {
                title,
                content,
                owner: { connect: { id: ownerId } },
            },
            include: {
                owner: { select: { id: true } },
            },
        });
        return result;
    }
    async pacthArticle({ articleId, title, content }) {
        const isValid = await this.getArticle({ articleId });
        if (!isValid)
            throw new error_1.default(404, "Article not found");
        const result = await prisma_1.default.article.update({
            where: {
                id: articleId
            },
            data: {
                title,
                content
            }
        });
        return result;
    }
    async poppedArticle({ articleId }) {
        const isValid = await this.getArticle({ articleId });
        if (!isValid)
            throw new error_1.default(404, "Article not found");
        await prisma_1.default.article.delete({
            where: {
                id: articleId
            }
        });
    }
}
exports.ArticleService = ArticleService;
