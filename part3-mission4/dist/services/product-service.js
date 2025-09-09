import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prismaClient.js';
import AppError from '../lib/appError.js';
// const prisma = new PrismaClient();
console.log('[Service] Imported prisma:', !!prisma);
class ProductService {
    // 전체 상품 조회
    async getAllProducts(query, userId) {
        const page = query.page || 1;
        const limit = query.limit || 10;
        const sort = query.sort || 'recent';
        const skip = (page - 1) * limit;
        const search = query.keyword || '';
        let orderBy;
        switch (sort) {
            case 'recent':
                orderBy = { createdAt: 'desc' };
                break;
            case 'old':
                orderBy = { createdAt: 'asc' };
                break;
            default:
                orderBy = { createdAt: 'desc' };
                break;
        }
        const where = search
            ? {
                OR: [
                    {
                        name: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        description: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                ],
            }
            : {};
        const products = await prisma.product.findMany({
            skip,
            take: limit,
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { username: true } },
                likedBy: true,
                comments: true,
            },
        });
        if (!products || products.length === 0) {
            throw new AppError('해당하는 제품을 찾을 수 없습니다.', 404);
        }
        const productsWithLike = products.map((p) => ({
            ...p,
            isLiked: userId ? p.likedBy?.length > 0 : false,
            likeCount: p.likeCount,
        }));
        const totalProducts = await prisma.product.count({ where });
        const totalPages = Math.ceil(totalProducts / limit);
        return {
            data: productsWithLike,
            pagination: { totalProducts, totalPages, currentPage: page, limit },
        };
    }
    // 단일 상품 조회
    async getProductById(productId, userId) {
        const include = {
            user: { select: { username: true } },
            comments: {
                select: {
                    id: true,
                    content: true,
                    createdAt: true,
                    updatedAt: true,
                    user: { select: { username: true } },
                    likeCount: true,
                    ...(userId && {
                        likedBy: {
                            where: { id: userId },
                            select: { id: true, username: true },
                        },
                    }),
                },
            },
            ...(userId && {
                likedBy: {
                    where: { id: userId },
                    select: { id: true, username: true },
                },
            }),
        };
        const product = await prisma.product.findUnique({
            where: { id: productId },
            include,
        });
        if (!product) {
            throw new AppError('존재하지 않는 상품입니다.', 404);
        }
        const productWithLike = {
            ...product,
            isLiked: product.likedBy?.length > 0 || false,
            likeCount: product.likeCount,
            comments: product.comments.map((c) => ({
                ...c,
                isLiked: c.likedBy?.length > 0 || false,
                likeCount: c.likeCount,
            })),
        };
        return productWithLike;
    }
    // 상품 등록
    async createProduct(userId, name, description, price, tags) {
        const newProduct = await prisma.product.create({
            data: {
                name,
                description,
                price,
                tags,
                user: { connect: { id: userId } },
            },
        });
        if (!newProduct) {
            throw new AppError('제품 등록에 실패했습니다.', 400);
        }
        return newProduct;
    }
    async updateProduct(productId, userId, updateData) {
        // 1. 제품 조회
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product)
            throw new AppError('존재하지 않는 제품입니다.', 404);
        if (product.userId !== userId)
            throw new AppError('권한이 없습니다.', 403);
        // 2. 제품 업데이트
        const updated = await prisma.product.update({
            where: { id: productId },
            data: updateData,
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                tags: true,
                images: true,
            },
        });
        return updated;
    }
    // 상품 삭제
    async deleteProduct(productId, userId) {
        const deleted = await prisma.product.deleteMany({
            where: { id: productId, userId },
        });
        if (deleted.count === 0) {
            throw new AppError('권한이 없거나 제품이 존재하지 않습니다.', 403);
        }
        return { message: '제품이 삭제되었습니다.' };
    }
    // 본인이 등록한 상품 조회
    async getUserProducts(userId) {
        const products = await prisma.product.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                tags: true,
                images: true,
                likeCount: true,
            },
        });
        return products;
    }
    // 좋아요한 상품 조회
    async getUserLikedProducts(userId) {
        const likedProducts = await prisma.product.findMany({
            where: { likedBy: { some: { id: userId } } },
        });
        return likedProducts;
    }
    // 상품 좋아요
    async productLike(userId, productId) {
        const productLiked = await prisma.product.update({
            where: { id: productId },
            data: {
                likedBy: { connect: { id: userId } },
                likeCount: { increment: 1 },
            },
        });
        return productLiked;
    }
    // 상품 좋아요 취소
    async productUnlike(userId, productId) {
        const productUnliked = await prisma.product.update({
            where: { id: productId },
            data: {
                likedBy: { disconnect: { id: userId } },
                likeCount: { decrement: 1 },
            },
        });
        return productUnliked;
    }
}
export const productService = new ProductService();
//# sourceMappingURL=product-service.js.map