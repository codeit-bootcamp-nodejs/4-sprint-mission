"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_js_1 = __importDefault(require("../../lib/prisma.js"));
const http_errors_1 = __importDefault(require("http-errors"));
const getProductDetail = async (req, res, next) => {
    const reqId = Number(req.params.id);
    if (!req.user) {
        return next((0, http_errors_1.default)(401, "Unauthorized"));
    }
    try {
        const product = await prisma_js_1.default.product.findUniqueOrThrow({
            where: {
                id: reqId,
            },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                tags: true,
                createdAt: true,
                likedUsers: {
                    where: { id: req.user.id },
                },
            },
        });
        const isLiked = product.likedUsers.length > 0;
        const result = {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            tags: product.tags,
            isLiked: isLiked,
            createdAt: product.createdAt,
        };
        res.status(200).send(result);
    }
    catch (err) {
        next(err);
    }
};
exports.default = getProductDetail;
//# sourceMappingURL=get.product.detail.js.map