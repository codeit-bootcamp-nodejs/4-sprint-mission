"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getLikeProducts;
const http_errors_1 = __importDefault(require("http-errors"));
const prisma_js_1 = __importDefault(require("../../lib/prisma.js"));
async function getLikeProducts(req, res, next) {
    if (!req.user) {
        return next((0, http_errors_1.default)(401, "Unauthorized"));
    }
    try {
        const product = await prisma_js_1.default.user.findUniqueOrThrow({
            where: {
                id: req.user.id,
            },
            select: {
                likeProducts: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        const result = product.likeProducts;
        res.status(200).json(result);
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=get.like.products.js.map