"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_js_1 = __importDefault(require("../../lib/prisma.js"));
const getArticleList = async (req, res, next) => {
    const { offset = 0, limit = 10, order = "recent", title = "", content = "", } = req.query;
    let sort = "desc";
    if (order == "recent")
        sort = "desc";
    else if (order == "lastest")
        sort = "asc";
    else
        sort = "desc";
    const resultes = await prisma_js_1.default.article.findMany({
        where: {
            title: { contains: String(title) },
            content: { contains: String(content) },
        },
        skip: Number(offset),
        take: Number(limit),
        orderBy: {
            createdAt: sort,
        },
    });
    res.status(200).send(resultes);
};
exports.default = getArticleList;
//# sourceMappingURL=get.article.list.js.map