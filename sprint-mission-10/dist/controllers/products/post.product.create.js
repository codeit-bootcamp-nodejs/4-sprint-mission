"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_js_1 = __importDefault(require("../../lib/prisma.js"));
const http_errors_1 = __importDefault(require("http-errors"));
const createProduct = async (req, res, next) => {
    if (!req.user) {
        return next((0, http_errors_1.default)(401, "Unauthorized"));
    }
    try {
        const product = await prisma_js_1.default.product.create({
            data: {
                ...req.body,
                owner: {
                    connect: {
                        id: req.user.id,
                    },
                },
            },
        });
        if (req.file) {
            return res.status(200).json({
                message: "파일 업로드 성공",
                body: product,
                filename: req.file.filename,
                filepath: `../image/${req.file.filename}`,
            });
        }
        res.status(200).send(product);
    }
    catch (err) {
        next(err);
    }
};
exports.default = createProduct;
//# sourceMappingURL=post.product.create.js.map