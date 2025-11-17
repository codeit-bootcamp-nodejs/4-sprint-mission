"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProductLike;
const prisma_js_1 = __importDefault(require("../../lib/prisma.js"));
const http_errors_1 = __importDefault(require("http-errors"));
async function ProductLike(req, res, next) {
    if (!req.user) {
        return next((0, http_errors_1.default)(401, "Unauthorized"));
    }
    try {
        const productId = Number(req.params.id);
        const product = await prisma_js_1.default.product.findUniqueOrThrow({
            where: {
                id: productId,
            },
            select: {
                likedUsers: {
                    where: {
                        id: req.user.id,
                    },
                },
            },
        });
        if (!product) {
            next((0, http_errors_1.default)(404, "제품을 찾을 수 없습니다."));
        }
        if (!(product.likedUsers.length > 0)) {
            likeProduct(productId, req.user.id);
            return res
                .status(200)
                .json({ message: `${productId}번 게시을에 좋아요` });
        }
        else {
            unLikeProduct(productId, req.user.id);
            return res
                .status(200)
                .json({ message: `${productId}번 게시을에 좋아요 취소` });
        }
    }
    catch (err) {
        next(err);
    }
}
async function likeProduct(productId, userId) {
    const result = await prisma_js_1.default.product.update({
        where: {
            id: productId,
        },
        data: {
            likedUsers: {
                connect: {
                    id: userId,
                },
            },
        },
    });
}
async function unLikeProduct(productId, userId) {
    const result = await prisma_js_1.default.product.update({
        where: {
            id: productId,
        },
        data: {
            likedUsers: {
                disconnect: {
                    id: userId,
                },
            },
        },
    });
}
//# sourceMappingURL=post.product.like.js.map