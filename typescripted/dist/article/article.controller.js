"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleController = void 0;
const article_service_1 = require("./article.service");
const articleService = new article_service_1.ArticleService();
class ArticleController {
    async getAticleListCont(query, res, next) {
        console.log("Received");
        try {
            const { take, page, keyword } = query;
            const skip = (page - 1) * take;
            const result = await articleService.getArticleList({
                take,
                skip,
                keyword,
            });
            return res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    async getArticleCont(params, res, next) {
        try {
            const articleId = Number(params.id);
            const result = await articleService.getArticle({ articleId });
            return res.json({ success: true, data: result });
        }
        catch (error) {
            if (!res.headersSent) {
                next(error); // 에러 핸들러에서 처리
            }
        }
    }
    async createArticleCont(body, res, next) {
        try {
            const { title, content } = body;
            const result = await articleService.createArticle({ title, content });
            return res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    async patchArticleCont(body, params, res, next) {
        try {
            const articleId = Number(params.id);
            const { title, content } = body;
            const modifiedData = await articleService.pacthArticle({
                articleId,
                title,
                content,
            });
            return res.json({ success: true, data: modifiedData });
        }
        catch (error) {
            next(error);
        }
    }
    async poppedArticleCont(params, res, next) {
        try {
            const articleId = params.id;
            await articleService.poppedArticle({ articleId });
            return res.json({ success: true });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ArticleController = ArticleController;
