"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const library_js_1 = require("@prisma/client/runtime/library.js");
const product_service_js_1 = require("./product.service.js");
const error_js_1 = __importDefault(require("../lib/error.js"));
;
const ProuductInstance = new product_service_js_1.ProuductService();
class ProductController {
    async getProductListCont(query, res, next) {
        try {
            console.log("요청이 들어옴");
            const { page, take } = query;
            const skip = (page - 1) * take;
            if (skip < 0 && skip > 100)
                throw new error_js_1.default(400, "skip 범위 오류");
            const ProductList = ProuductInstance.getProductList({
                input: [],
                pagenataion: { take, skip },
            });
            return res.json({ success: true, data: ProductList });
        }
        catch (error) {
            next(error);
        }
    }
    async getProductCont(params, res, next) {
        try {
            const productId = params.id;
            const Item = await ProuductInstance.getProduct({ id: productId });
            return res.json({ success: true, data: Item });
        }
        catch (error) {
            next(error);
        }
    }
    async createProductCont(req, res, next) {
        try {
            const { name, description, price, productTags, ownerId } = req.body;
            const newProduct = await ProuductInstance.createdProduct({
                input: {
                    name,
                    description,
                    price,
                    productTags,
                    ownerId,
                },
            });
            return res.json({ success: true, data: newProduct });
        }
        catch (error) {
            console.error(error);
            if (error instanceof library_js_1.PrismaClientKnownRequestError) {
                if (error.code === "P2025")
                    console.log("2025 에러발생");
            }
            else if (error instanceof Error) {
                console.log("general error", error.message);
            }
            next(error);
        }
    }
    async modifiedProductCont(params, body, res, next) {
        try {
            const productId = params.id;
            const { name, description, price, productTags } = body;
            const uniqueProduct = await ProuductInstance.getProduct({
                id: productId,
            });
            if (!uniqueProduct)
                throw new error_js_1.default(404, "not found");
            const updatatedData = await ProuductInstance.modifiedProduct({
                input: { id: productId, name, description, price, productTags },
            });
            return res.json({ success: true, data: updatatedData });
        }
        catch (error) {
            next(error);
        }
    }
    async poppedProductCont(params, res, next) {
        try {
            const productId = params.id;
            await ProuductInstance.deletedProduct({ id: productId });
            return res.json({ success: true });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ProductController = ProductController;
