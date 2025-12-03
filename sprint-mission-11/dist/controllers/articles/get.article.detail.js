"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_js_1 = __importDefault(require("../../lib/prisma.js"));
const http_errors_1 = __importDefault(require("http-errors"));
const getArticleDetail = async (req, res, next) => {
    const reqId = Number(req.params.id);
    if (!req.user) {
        return next((0, http_errors_1.default)(401, "Unauthorized"));
    }
    try {
        const article = await prisma_js_1.default.article.findUniqueOrThrow({
            where: {
                id: reqId,
            },
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
                likedUsers: {
                    where: {
                        id: req.user.id,
                    },
                },
            },
        });
        const isLiked = article.likedUsers.length > 0;
        const result = {
            id: article.id,
            name: article.title,
            description: article.content,
            isLiked: isLiked,
            createdAt: article.createdAt,
        };
        res.status(200).send(result);
    }
    catch (err) {
        next(err);
    }
};
exports.default = getArticleDetail;
//# sourceMappingURL=get.article.detail.js.map