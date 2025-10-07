import { Prisma } from '@prisma/client';
import { productRepository } from '../repositories/product-repository.js';
import { productLikeRepository, commentLikeRepository, } from '../repositories/like-repository.js';
import AppError from '../lib/appError.js';
class ProductService {
    // 전체 상품 조회
    async getAllProducts(query, userId) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const skip = (page - 1) * limit;
        const sort = query.sort || 'recent';
        const search = query.keyword || '';
        const orderBy = sort === 'old' ? { createdAt: 'asc' } : { createdAt: 'desc' };
        const where = search
            ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                ],
            }
            : {};
        const products = await productRepository.findMany({
            skip,
            take: limit,
            where,
            orderBy,
            include: {
                user: { select: { username: true } },
                comments: {
                    include: { user: { select: { username: true } } },
                },
            },
        });
        const productsWithLike = await Promise.all(products.map(async (p) => {
            const likeCount = await productLikeRepository.count(p.id);
            const isLiked = userId
                ? await productLikeRepository.exists(userId, p.id)
                : false;
            const commentsWithLikes = await Promise.all(p.comments.map(async (c) => {
                const cLikeCount = await commentLikeRepository.count(c.id);
                const cIsLiked = userId
                    ? await commentLikeRepository.exists(userId, c.id)
                    : false;
                return {
                    ...c,
                    likeCount: cLikeCount,
                    isLiked: cIsLiked,
                };
            }));
            return {
                ...p,
                likeCount,
                isLiked,
                comments: commentsWithLikes,
            };
        }));
        const totalProducts = await productRepository.count(where);
        const totalPages = Math.ceil(totalProducts / limit);
        return {
            data: productsWithLike,
            pagination: { totalProducts, totalPages, currentPage: page, limit },
        };
    }
    // 단일 상품 조회
    async getProductById(productId, userId) {
        const product = await productRepository.findUnique(productId, userId);
        if (!product)
            throw new AppError('존재하지 않는 상품입니다.', 404);
        const likeCount = await productLikeRepository.count(product.id);
        const isLiked = userId
            ? await productLikeRepository.exists(userId, product.id)
            : false;
        const commentsWithLikes = await Promise.all(product.comments.map(async (c) => {
            const cLikeCount = await commentLikeRepository.count(c.id);
            const cIsLiked = userId
                ? await commentLikeRepository.exists(userId, c.id)
                : false;
            return {
                ...c,
                likeCount: cLikeCount,
                isLiked: cIsLiked,
            };
        }));
        const productWithLike = {
            ...product,
            likeCount,
            isLiked,
            comments: commentsWithLikes,
        };
        return productWithLike;
    }
    async createProduct(userId, name, description, price, tags) {
        const newProduct = await productRepository.create({
            userId,
            name,
            description,
            price,
            tags,
        });
        if (!newProduct)
            throw new AppError('제품 등록 실패', 400);
        return newProduct;
    }
    async updateProduct(productId, userId, updateData) {
        const product = await productRepository.findUnique(productId);
        if (!product)
            throw new AppError('제품 없음', 404);
        if (product.userId !== userId)
            throw new AppError('권한 없음', 403);
        await productRepository.update(productId, userId, updateData);
        return { message: '상품이 수정되었습니다.' };
    }
    async deleteProduct(productId, userId) {
        const deleted = await productRepository.delete(productId, userId);
        if (deleted.count === 0)
            throw new AppError('권한 없거나 제품 없음', 403);
        return { message: '제품 삭제 완료' };
    }
    // ---------------------------
    // 본인 상품 조회
    async getUserProducts(userId) {
        return productRepository.findUserProducts(userId);
    }
    // 좋아요한 상품 조회
    async getUserLikedProducts(userId) {
        return productRepository.findLikedProducts(userId);
    }
    // 상품 좋아요
    async productLike(userId, productId) {
        const alreadyLiked = await productLikeRepository.exists(userId, productId);
        if (alreadyLiked) {
            throw new AppError('이미 좋아요를 눌렀습니다.', 400);
        }
        await productLikeRepository.create(userId, productId);
        const count = await productLikeRepository.count(productId);
        return { message: '좋아요 완료', likeCount: count };
    }
    // 상품 좋아요 취소
    async productUnlike(userId, productId) {
        const exists = await productLikeRepository.exists(userId, productId);
        if (!exists) {
            throw new AppError('좋아요를 누른 기록이 없습니다.', 400);
        }
        await productLikeRepository.delete(userId, productId);
        const count = await productLikeRepository.count(productId);
        return { message: '좋아요 취소', likeCount: count };
    }
}
export const productService = new ProductService();
//# sourceMappingURL=product-service.js.map