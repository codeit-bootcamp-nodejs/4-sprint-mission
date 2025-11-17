"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_js_1 = __importDefault(require("../../lib/prisma.js"));
const getProductList = async (req, res, next) => {
    const { offset = 0, limit = 10, order = "recent", name = "", description = "", } = req.query;
    let sort = "desc";
    if (order == "recent")
        sort = "desc";
    else if (order == "lastest")
        sort = "asc";
    else
        sort = "desc";
    try {
        const products = await prisma_js_1.default.product.findMany({
            // where: {
            //   name: { contains: String(name) },
            //   description: { contains: String(description) },
            // },
            skip: Number(offset),
            take: Number(limit),
            orderBy: {
                updateAt: sort,
            },
        });
        res.status(200).send(products);
    }
    catch (err) {
        next(err);
    }
};
exports.default = getProductList;
//# sourceMappingURL=get.product.list.js.map