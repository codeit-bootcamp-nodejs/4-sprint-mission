"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const productService_1 = require("../services/productService");
const product_dto_1 = require("../dtos/product.dto");
const productService = new productService_1.ProductService();
class ProductController {
    async create(req, res, next) {
        try {
            if (!req.user)
                return res.status(http_status_1.default.UNAUTHORIZED).json({ message: "Unauthorized" });
            const parsed = product_dto_1.ProductCreateSchema.parse(req.body);
            const product = await productService.create(req.user.id, parsed);
            res.status(http_status_1.default.CREATED).json(product);
        }
        catch (err) {
            next(err);
        }
    }
    async list(req, res, next) {
        try {
            const parsed = product_dto_1.ProductQuerySchema.parse(req.query);
            const products = await productService.list(parsed);
            res.status(http_status_1.default.OK).json(products);
        }
        catch (err) {
            next(err);
        }
    }
    async detail(req, res, next) {
        try {
            const productId = Number(req.params.id);
            const product = await productService.getDetail(productId);
            if (!product)
                return res.status(http_status_1.default.NOT_FOUND).json({ message: "Product not found" });
            res.status(http_status_1.default.OK).json(product);
        }
        catch (err) {
            next(err);
        }
    }
    async update(req, res, next) {
        try {
            if (!req.user)
                return res.status(http_status_1.default.UNAUTHORIZED).json({ message: "Unauthorized" });
            const parsed = product_dto_1.ProductUpdateSchema.parse(req.body);
            const productId = Number(req.params.id);
            const updated = await productService.update(req.user.id, productId, parsed);
            res.status(http_status_1.default.OK).json(updated);
        }
        catch (err) {
            if (err.message === "NOT_FOUND")
                return res.status(http_status_1.default.NOT_FOUND).json({ message: "Product not found" });
            if (err.message === "FORBIDDEN")
                return res.status(http_status_1.default.FORBIDDEN).json({ message: "User not matched" });
            next(err);
        }
    }
    async delete(req, res, next) {
        try {
            if (!req.user)
                return res.status(http_status_1.default.UNAUTHORIZED).json({ message: "Unauthorized" });
            const productId = Number(req.params.id);
            await productService.delete(req.user.id, productId);
            res.status(http_status_1.default.NO_CONTENT).end();
        }
        catch (err) {
            if (err.message === "NOT_FOUND")
                return res.status(http_status_1.default.NOT_FOUND).json({ message: "Product not found" });
            if (err.message === "FORBIDDEN")
                return res.status(http_status_1.default.FORBIDDEN).json({ message: "User not matched" });
            next(err);
        }
    }
}
exports.ProductController = ProductController;
//# sourceMappingURL=productController.js.map