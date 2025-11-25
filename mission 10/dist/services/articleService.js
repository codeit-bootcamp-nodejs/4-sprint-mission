"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleService = void 0;
const articleRepository_1 = require("../repositories/articleRepository");
class ArticleService {
    constructor() {
        this.repo = new articleRepository_1.ArticleRepository();
    }
    async create(userId, data) {
        return this.repo.createArticle({ ...data, userId });
    }
    async list({ page, pageSize, keyword }) {
        const where = keyword
            ? {
                OR: [
                    { title: { contains: keyword, mode: "insensitive" } },
                    { content: { contains: keyword, mode: "insensitive" } },
                ],
            }
            : {};
        return this.repo.findMany(where, (page - 1) * pageSize, pageSize);
    }
    async getDetail(id) {
        return this.repo.findById(id);
    }
    async update(userId, data, articleId) {
        const article = await this.repo.findById(articleId);
        if (!article)
            throw new Error("NOT_FOUND");
        if (article.userId !== userId)
            throw new Error("FORBIDDEN");
        return this.repo.updatedArticle(articleId, data);
    }
    async delete(userId, articleId) {
        const article = await this.repo.findById(articleId);
        if (!article)
            throw new Error("NOT_FOUND");
        if (article.userId !== userId)
            throw new Error("FORBIDDEN");
        await this.repo.deleteArticle(articleId);
    }
}
exports.ArticleService = ArticleService;
exports.default = new ArticleService();
//# sourceMappingURL=articleService.js.map