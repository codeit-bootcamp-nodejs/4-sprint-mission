"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const articleService_1 = require("../services/articleService");
const article_dto_1 = require("../dtos/article.dto");
const articleService = new articleService_1.ArticleService();
class ArticleController {
    async create(req, res, next) {
        try {
            if (!req.user)
                return res.status(http_status_1.default.UNAUTHORIZED).json({ message: "Unauthorized" });
            const parsed = article_dto_1.ArticleCreateSchema.parse(req.body);
            const article = await articleService.create(req.user.id, parsed);
            res.status(http_status_1.default.CREATED).json(article);
        }
        catch (err) {
            next(err);
        }
    }
    async list(req, res, next) {
        try {
            const parsed = article_dto_1.ArticleQuerySchema.parse(req.query);
            const articles = await articleService.list(parsed);
            res.status(http_status_1.default.OK).json(articles);
        }
        catch (err) {
            next(err);
        }
    }
    async detail(req, res, next) {
        try {
            const articleId = Number(req.params.id);
            const article = await articleService.getDetail(articleId);
            if (!article)
                return res.status(http_status_1.default.NOT_FOUND).json({ message: "Article not found" });
            res.status(http_status_1.default.OK).json(article);
        }
        catch (err) {
            next(err);
        }
    }
    async update(req, res, next) {
        try {
            if (!req.user)
                return res.status(http_status_1.default.UNAUTHORIZED).json({ message: "Unauthorized" });
            const parsed = article_dto_1.ArticleUpdateSchema.parse(req.body);
            const articleId = Number(req.params.id);
            const updated = await articleService.update(req.user.id, parsed, articleId);
            res.status(http_status_1.default.OK).json(updated);
        }
        catch (err) {
            if (err.message === "NOT_FOUND")
                return res.status(http_status_1.default.NOT_FOUND).json({ message: "Article not found" });
            if (err.message === "FORBIDDEN")
                return res.status(http_status_1.default.FORBIDDEN).json({ message: "User not matched" });
            next(err);
        }
    }
    async delete(req, res, next) {
        try {
            if (!req.user)
                return res.status(http_status_1.default.UNAUTHORIZED).json({ message: "Unauthorized" });
            const articleId = Number(req.params.id);
            await articleService.delete(req.user.id, articleId);
            res.status(http_status_1.default.NO_CONTENT).end();
        }
        catch (err) {
            if (err.message === "NOT_FOUND")
                return res.status(http_status_1.default.NOT_FOUND).json({ message: "Article not found" });
            if (err.message === "FORBIDDEN")
                return res.status(http_status_1.default.FORBIDDEN).json({ message: "User not matched" });
            next(err);
        }
    }
}
exports.ArticleController = ArticleController;
//# sourceMappingURL=articleController.js.map