// src/services/productService.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const productService = {
    
    async getAllProducts(queryParams = {}) {
        const {
            offset = 0,
            limit = 5,
            order = "asc",
            search = "",
        } = queryParams;

        let orderBy;
        switch (order) {
            case "recent":
                orderBy = { createdAt: "desc" };
                break;
            case "asc":
            default:
                orderBy = { createdAt: "asc" };
                break;
        }

        const whereClause = search
            ? {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                ],
              }
            : {};

        const products = await prisma.product.findMany({
            where: whereClause,
            orderBy,
            skip: parseInt(offset),
            take: parseInt(limit),
            select: {
                id: true,
                name: true,
                price: true,
                createdAt: true,
            },
        });

        return products;
    },

    async createProduct(productData) {
        const product = await prisma.product.create({
            data: productData,
        });
        return product;
    },

    async getProductById(productId) {
        const product = await prisma.product.findUniqueOrThrow({
            where: { id: productId },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                tags: true,
                createdAt: true,
            },
        });
        return product;
    },

    async updateProduct(productId, updateData) {
        const product = await prisma.product.update({
            where: { id: productId },
            data: updateData,
        });
        return product;
    },

    async deleteProduct(productId) {
        await prisma.product.delete({
            where: { id: productId },
        });
    },

    async getProductComments(productId, queryParams = {}) {
        const { cursor, limit = 5 } = queryParams;

        const queryOptions = {
            where: { productId },
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                content: true,
                createdAt: true,
            },
            take: parseInt(limit),
            ...(cursor && { cursor: { id: parseInt(cursor) }, skip: 1 }),
        };

        const comments = await prisma.comment.findMany(queryOptions);

        const nextCursor =
            comments.length === parseInt(limit)
                ? comments[comments.length - 1].id
                : null;

        return { comments, nextCursor };
    },

    async createCommentForProduct(productId, commentData) {
        const { content } = commentData;

        // 상품 존재 여부 확인
        await prisma.product.findUniqueOrThrow({
            where: { id: productId },
        });

        const comment = await prisma.comment.create({
            data: {
                productId,
                content,
            },
        });
        return comment;
    },
};
