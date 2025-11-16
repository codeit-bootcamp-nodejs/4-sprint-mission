import * as productRepository from '../repositories/productRepository.js';
import * as likeRepository from '../repositories/likeRepository.js';
import * as notificationService from './notificationService.js';
import { CustomError } from '../middlewares/errorHandler.js';
import prisma from '../config/prisma.js';
import type { CreateProductData, UpdateProductData, ProductWithLike } from '../types/product.js';

// 상품 생성 로직
export const createProduct = async (productData: CreateProductData) => {
    return prisma.$transaction(async (tx) => {
        return productRepository.createProductWithTags(productData, tx);
    });
};

// 상품 목록 조회 로직
export const findProducts = async () => {
    return productRepository.findProducts();
};

// 유저가 등록한 상품 목록 조회 로직
export const findProductsByUserId = async (userId: number) => {
    return productRepository.findProductsByUserId(userId);
};

// 특정 상품 상세 조회 로직 (좋아요 상태 포함)
export const findProductById = async (id: number, userId?: number | null): Promise<ProductWithLike> => {
    const product = await productRepository.findProductWithTagsById(id);
    if (!product) {
        throw new CustomError('상품을 찾을 수 없습니다.', 404);
    }

    // 유저가 로그인한 경우에만 좋아요 상태를 확인합니다.
    let isLiked = false;
    if (userId) {
        const liked = await likeRepository.findLike('product', id, userId);
        if (liked) {
            isLiked = true;
        }
    }

    // 응답 객체에 isLiked 필드 추가
    const tags = product.productTags?.map((pt) => pt.tag) || [];
    return { ...product, isLiked, tags };
};

// 상품 수정 로직 (권한 확인 및 트랜잭션)
export const updateProduct = async (productId: number, userId: number, productData: UpdateProductData) => {
    let priceChanged = false;
    let likedUserIds: number[] = [];

    // 1. 상품 업데이트 트랜잭션
    const updatedProduct = await prisma.$transaction(async (tx) => {
        // 상품 존재 여부 및 권한 확인
        const existingProduct = await productRepository.findProductById(productId, tx);
        if (!existingProduct) {
            throw new CustomError('상품을 찾을 수 없습니다.', 404);
        }
        if (existingProduct.userId !== userId) {
            throw new CustomError('상품을 수정할 권한이 없습니다.', 403);
        }

        // 가격이 변경되었는지 확인
        priceChanged = !!(productData.price && productData.price !== existingProduct.price);

        if (priceChanged) {
            // 이 상품을 좋아요한 사용자들 조회
            const likes = await tx.like.findMany({
                where: { productId },
                select: { userId: true },
            });
            likedUserIds = likes.map(like => like.userId).filter(id => id !== userId);
        }

        // 상품 정보 및 태그 업데이트
        return productRepository.updateProductWithTags(productId, productData, tx);
    });

    // 2. 알림 전송 (별도 트랜잭션)
    if (priceChanged && likedUserIds.length > 0) {
        await Promise.all(
            likedUserIds.map(async (likedUserId) => {
                await notificationService.createAndSendNotification({
                    type: 'PRICE_CHANGE',
                    message: `좋아요한 상품의 가격이 변경되었습니다.`,
                    userId: likedUserId,
                    productId,
                });
            })
        );
    }

    return updatedProduct;
};

// 상품 삭제 로직 (권한 확인 및 트랜잭션)
export const deleteProduct = async (productId: number, userId: number) => {
    return prisma.$transaction(async (tx) => {
        // 1. 상품 존재 여부 및 권한 확인
        const product = await productRepository.findProductById(productId, tx);
        if (!product) {
            throw new CustomError('상품을 찾을 수 없습니다.', 404);
        }
        if (product.userId !== userId) {
            throw new CustomError('상품을 삭제할 권한이 없습니다.', 403);
        }

        // 2. 상품 삭제
        await productRepository.deleteProduct(productId, tx);
        return { message: '상품이 성공적으로 삭제되었습니다.' };
    });
};
