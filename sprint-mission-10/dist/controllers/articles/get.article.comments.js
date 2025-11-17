"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_js_1 = __importDefault(require("../../lib/prisma.js"));
const getArticleComment = async (req, res, next) => {
    const reqId = Number(req.params.id);
    let cursor = 1;
    try {
        if (req.query.cursor)
            cursor = Number(req.query.cursor);
        const result = await prisma_js_1.default.article.findMany({
            where: {
                id: reqId,
            },
            select: {
                comments: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            cursor: { id: cursor },
            take: 10,
        });
        res.status(200).send(result);
    }
    catch (err) {
        next(err);
    }
};
exports.default = getArticleComment;
//# sourceMappingURL=get.article.comments.js.map