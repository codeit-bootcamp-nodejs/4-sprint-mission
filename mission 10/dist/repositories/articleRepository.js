"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleRepository = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
class ArticleRepository {
    async createArticle(data) {
        return prisma_1.default.article.create({ data });
    }
    async findMany(where, skip, take) {
        return prisma_1.default.article.findMany({
            skip,
            take,
            orderBy: { createdAt: "desc" },
            select: { id: true, title: true, content: true, createdAt: true },
            where,
        });
    }
    async findById(id) {
        return prisma_1.default.article.findUnique({
            where: { id },
            select: { id: true, userId: true, title: true, content: true, createdAt: true },
        });
    }
    async updatedArticle(id, data) {
        const updateData = {};
        if (data.title !== undefined)
            updateData.title = data.title;
        if (data.content !== undefined)
            updateData.content = data.content;
        return prisma_1.default.article.update({ where: { id }, data: updateData });
    }
    async deleteArticle(id) {
        await prisma_1.default.article.delete({ where: { id } });
    }
}
exports.ArticleRepository = ArticleRepository;
exports.default = new ArticleRepository();
//# sourceMappingURL=articleRepository.js.map