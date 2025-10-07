"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProuductService = void 0;
const error_js_1 = __importDefault(require("../lib/error.js"));
const prisma_js_1 = __importDefault(require("../lib/prisma.js"));
class ProuductService {
    async getProductList(input, keyword) {
        const { take, skip } = input.pagenataion;
        const whereCondition = keyword
            ? {
                OR: [
                    { name: { contains: keyword } },
                    { description: { contains: keyword } },
                ],
            }
            : {};
        const ProductList = await prisma_js_1.default.product.findMany({
            take,
            skip,
            where: whereCondition,
            include: { productTags: true, comments: true, owner: true },
        });
        return ProductList;
    }
    async getProduct({ id }) {
        const uniqueProduct = await prisma_js_1.default.product.findUnique({
            where: { id },
            include: { productTags: true, comments: true, owner: true },
        });
        if (!uniqueProduct)
            throw { status: 404, message: "invalid product" };
        return uniqueProduct;
    }
    async createdProduct({ input }) {
        const { name, description, price, productTags, ownerId } = input;
        //console.log("name:",name,"description", description,"price", price,"productTags", productTags , "ownerid",ownerId)
        //console.log("ownerid type:",typeof ownerId)
        const user = await prisma_js_1.default.user.findUnique({
            where: { id: ownerId }
        });
        console.log("User found:", user);
        if (!user)
            throw new error_js_1.default(404, "User not found");
        const newProduct = await prisma_js_1.default.product.create({
            data: {
                name,
                description,
                price,
                owner: { connect: { id: ownerId } },
                productTags: { create: productTags },
            },
            include: {
                productTags: true,
                comments: true,
                owner: {
                    select: {
                        id: true,
                        nickname: true,
                    },
                },
            },
        });
        return newProduct;
    }
    async modifiedProduct({ input }) {
        const productId = input.id;
        const newTagIds = input.productTags ?? [];
        //console.log("newTagIds:", newTagIds)
        const uniqueProduct = await prisma_js_1.default.product.findUnique({
            where: { id: productId },
            include: {
                productTags: true,
                comments: true,
                owner: {
                    select: {
                        id: true,
                        nickname: true,
                    },
                },
            },
        });
        if (!uniqueProduct)
            throw new error_js_1.default(404, "invalid product");
        await prisma_js_1.default.$transaction(async (tx) => {
            await tx.productTag.deleteMany({
                where: { productId },
            });
            await Promise.all(newTagIds.map(({ tagId }) => tx.productTag.upsert({
                where: { productId_tagId: { productId, tagId } },
                create: { productId, tagId },
                update: {},
            })));
        });
        const updatatedData = await prisma_js_1.default.product.update({
            where: { id: productId },
            data: {
                name: input.name ?? null,
                description: input.description ?? null,
                price: input.price,
            },
            include: {
                productTags: true,
                comments: true,
                owner: {
                    select: {
                        id: true,
                        nickname: true,
                    },
                },
            },
        });
        return updatatedData;
    }
    async deletedProduct({ id }) {
        const uniqueProduct = await this.getProduct({ id });
        if (!uniqueProduct)
            throw new error_js_1.default(404, "invalid product");
        await prisma_js_1.default.product.delete({
            where: { id }
        });
    }
}
exports.ProuductService = ProuductService;
