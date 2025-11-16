import { prisma } from '../utils/prisma.util.js';
export class ProductsRepository {
    constructor() {
        this.createProduct = async (data) => {
            return await prisma.product.create({ data });
        };
        this.findProducts = async () => {
            return await prisma.product.findMany({
                select: {
                    id: true,
                    name: true,
                    content: true,
                    createdAt: true,
                    updatedAt: true,
                    author: {
                        select: {
                            nickname: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
        };
        this.findProductById = async (productId) => {
            return await prisma.product.findUnique({
                where: { id: productId },
                select: {
                    id: true,
                    name: true,
                    content: true,
                    createdAt: true,
                    updatedAt: true,
                    author: {
                        select: {
                            nickname: true,
                        },
                    },
                },
            });
        };
        this.findProductByIdSimple = async (productId) => {
            return await prisma.product.findUnique({ where: { id: productId } });
        };
        this.updateProduct = async (productId, data) => {
            return await prisma.product.update({
                where: { id: productId },
                data,
            });
        };
        this.deleteProduct = async (productId) => {
            return await prisma.product.delete({ where: { id: productId } });
        };
        this.findProductLike = async (userId, productId) => {
            return await prisma.productLike.findUnique({
                where: {
                    userId_productId: {
                        userId,
                        productId,
                    },
                },
            });
        };
        this.createProductLike = async (userId, productId) => {
            return await prisma.productLike.create({
                data: {
                    userId,
                    productId,
                },
            });
        };
        this.deleteProductLike = async (userId, productId) => {
            return await prisma.productLike.delete({
                where: {
                    userId_productId: {
                        userId,
                        productId,
                    },
                },
            });
        };
        this.findProductsByAuthorId = async (authorId) => {
            return await prisma.product.findMany({
                where: { authorId },
                orderBy: {
                    createdAt: "desc",
                },
            });
        };
        this.findLikedProductsByUserId = async (userId) => {
            return await prisma.product.findMany({
                where: {
                    likes: {
                        some: {
                            userId,
                        },
                    },
                },
                select: {
                    id: true,
                    name: true,
                    content: true,
                    createdAt: true,
                    updatedAt: true,
                    author: {
                        select: {
                            nickname: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        };
        this.findProductLikesByProductId = async (productId) => {
            return await prisma.productLike.findMany({
                where: { productId },
                select: {
                    userId: true,
                },
            });
        };
    }
}
