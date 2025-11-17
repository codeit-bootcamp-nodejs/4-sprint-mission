"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_js_1 = __importDefault(require("../../lib/prisma.js"));
const http_errors_1 = __importDefault(require("http-errors"));
const createProductComment = async (req, res, next) => {
    try {
        const reqId = Number(req.params.id);
        if (!req.user) {
            return next((0, http_errors_1.default)(401, "Unauthorized"));
        }
        const product = await prisma_js_1.default.product.findUnique({
            where: { id: reqId, ownerId: req.user.id },
        });
        if (!product)
            return next((0, http_errors_1.default)(400, "목표 데이터를 찾을 수 없습니다"));
        const result = await prisma_js_1.default.comment.create({
            data: {
                content: req.body.content,
                productId: reqId,
                ownerId: req.user.id,
            },
        });
        res.status(200).send(result);
    }
    catch (err) {
        next(err);
    }
};
exports.default = createProductComment;
//# sourceMappingURL=post.product.comment.create.js.map