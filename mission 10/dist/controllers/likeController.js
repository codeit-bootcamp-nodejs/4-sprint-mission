"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const likeService_1 = require("../services/likeService");
const likeService = new likeService_1.LikeService();
class LikeController {
    async likeArticle(req, res, next) {
        if (!req.user)
            return res.status(http_status_1.default.UNAUTHORIZED).json({ message: "Unauthorized" });
        try {
            const result = await likeService.likeArticle(req.user.id, Number(req.params.id));
            res.status(http_status_1.default.OK).json({ message: "Like toggled", isLiked: result.like });
        }
        catch (err) {
            if (err.message === "ARTICLE_NOT_FOUND")
                return res.status(http_status_1.default.NOT_FOUND).json({ message: "Article not found" });
            next(err);
        }
    }
    async likeProduct(req, res, next) {
        if (!req.user)
            return res.status(http_status_1.default.UNAUTHORIZED).json({ message: "Unauthorized" });
        try {
            const result = await likeService.likeProduct(req.user.id, Number(req.params.id));
            res.status(http_status_1.default.OK).json({ message: "Like toggled", isLiked: result.like });
        }
        catch (err) {
            if (err.message === "PRODUCT_NOT_FOUND")
                return res.status(http_status_1.default.NOT_FOUND).json({ message: "Product not found" });
            next(err);
        }
    }
    async getLikedArticles(req, res, next) {
        if (!req.user)
            return res.status(http_status_1.default.UNAUTHORIZED).json({ message: "Unauthorized" });
        try {
            const likedArticles = await likeService.getLikedArticles(req.user.id);
            const articles = likedArticles.map((l) => ({ ...l.article, isLiked: true }));
            res.status(http_status_1.default.OK).json(articles);
        }
        catch (err) {
            next(err);
        }
    }
    async getLikedProducts(req, res, next) {
        if (!req.user)
            return res.status(http_status_1.default.UNAUTHORIZED).json({ message: "Unauthorized" });
        try {
            const likedProducts = await likeService.getLikedProducts(req.user.id);
            const products = likedProducts.map((l) => ({ ...l.product, isLiked: true }));
            res.status(http_status_1.default.OK).json(products);
        }
        catch (err) {
            next(err);
        }
    }
}
exports.LikeController = LikeController;
//# sourceMappingURL=likeController.js.map