import { Prisma } from '@prisma/client';
import { productRepository } from '../repositories/product-repository.js';
import {
  productLikeRepository,
  commentLikeRepository,
} from '../repositories/like-repository.js';
import type { ProductQuery, UpdateProductDto } from '../dtos/product-dto.js';
import AppError from '../lib/appError.js';
import { notificationService } from './notification-service.js';

class ProductService {
  // 전체 상품 조회
  async getAllProducts(query: ProductQuery, userId?: number) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const sort = query.sort || 'recent';
    const search = query.keyword || '';

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      sort === 'old' ? { createdAt: 'asc' } : { createdAt: 'desc' };

    const where: Prisma.ProductWhereInput = search
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

    const productIds = products.map((p) => p.id);
    const commentIds = products.flatMap((p) => p.comments.map((c) => c.id));

    const productLikeCounts = await productLikeRepository.countByTargetIds(
      productIds
    );
    const productLikeCountMap = Object.fromEntries(
      productLikeCounts.map((pl) => [pl.productId, pl._count.productId])
    );

    const commentLikeCounts = await commentLikeRepository.countByTargetIds(
      commentIds
    );
    const commentLikeCountMap = Object.fromEntries(
      commentLikeCounts.map((cl) => [cl.commentId, cl._count.commentId])
    );

    let myLikedProductIds: number[] = [];
    let myLikedCommentIds: number[] = [];

    if (userId) {
      const likedProducts = await productLikeRepository.findByUserAndTargetIds(
        userId,
        productIds
      );
      myLikedProductIds = likedProducts.map((l) => l.productId);

      const likedComments = await commentLikeRepository.findByUserAndTargetIds(
        userId,
        commentIds
      );
      myLikedCommentIds = likedComments.map((l) => l.commentId);
    }

    const productsWithLike = products.map((p) => ({
      ...p,
      likeCount: productLikeCountMap[p.id] || 0,
      isLiked: userId ? myLikedProductIds.includes(p.id) : false,
      comments: p.comments.map((c) => ({
        ...c,
        likeCount: commentLikeCountMap[c.id] || 0,
        isLiked: userId ? myLikedCommentIds.includes(c.id) : false,
      })),
    }));

    const totalProducts = await productRepository.count(where);
    const totalPages = Math.ceil(totalProducts / limit);

    return {
      data: productsWithLike,
      pagination: { totalProducts, totalPages, currentPage: page, limit },
    };
  }

  // 단일 상품 조회
  async getProductById(productId: number, userId?: number) {
    const product = await productRepository.findUnique(productId, userId);

    if (!product) throw new AppError('존재하지 않는 상품입니다.', 404);

    const likeCount = await productLikeRepository.count(product.id);
    const isLiked = userId
      ? await productLikeRepository.exists(userId, product.id)
      : false;

    const commentIds = product.comments.map((c) => c.id);

    const commentLikeCounts = await commentLikeRepository.countByTargetIds(
      commentIds
    );
    const commentLikeCountMap = Object.fromEntries(
      commentLikeCounts.map((cl) => [cl.commentId, cl._count.commentId])
    );

    let myLikedCommentIds: number[] = [];
    if (userId) {
      const likedComments = await commentLikeRepository.findByUserAndTargetIds(
        userId,
        commentIds
      );
      myLikedCommentIds = likedComments.map((l) => l.commentId);
    }

    const commentsWithLikes = product.comments.map((c) => ({
      ...c,
      likeCount: commentLikeCountMap[c.id] || 0,
      isLiked: userId ? myLikedCommentIds.includes(c.id) : false,
    }));

    const productWithLike = {
      ...product,
      likeCount,
      isLiked,
      comments: commentsWithLikes,
    };

    return productWithLike;
  }

  async createProduct(
    userId: number,
    name: string,
    description: string,
    price: number,
    tags: string[]
  ) {
    const newProduct = await productRepository.create({
      userId,
      name,
      description,
      price,
      tags,
    });
    if (!newProduct) throw new AppError('제품 등록 실패', 400);
    return newProduct;
  }

  async updateProductPrice(
    productId: number,
    newPrice: number,
    actorUserId: number
  ) {
    // 1. 기존 상품
    const product = await productRepository.findUnique(productId);
    if (!product) {
      throw new AppError('존재하지 않는 상품입니다.', 404);
    }

    // 2. 가격 실제로 바뀌었는지
    if (product.price !== newPrice) {
      // DB 반영
      const updated = await productRepository.updatePrice(productId, newPrice);

      // 좋아요한 유저들
      const likedUsers = await productLikeRepository.findUsersWhoLikedProduct(
        productId
      );

      // 각각에게 알림
      for (const u of likedUsers) {
        await notificationService.pushPriceChange({
          receiverUserId: u.id,
          productId,
          oldPrice: product.price,
          newPrice,
          productName: product.name,
        });
      }

      return updated;
    }

    // 가격이 같으면 그냥 원래 상품 리턴해도 됨
    return product;
  }

  async updateProduct(
    productId: number,
    userId: number,
    updateData: UpdateProductDto
  ) {
    const product = await productRepository.findUnique(productId);
    if (!product) throw new AppError('제품 없음', 404);
    if (product.userId !== userId) throw new AppError('권한 없음', 403);

    await productRepository.update(productId, userId, updateData);

    return { message: '상품이 수정되었습니다.' };
  }

  async deleteProduct(productId: number, userId: number) {
    const deleted = await productRepository.delete(productId, userId);
    if (deleted.count === 0) throw new AppError('권한 없거나 제품 없음', 403);
    return { message: '제품 삭제 완료' };
  }

  // ---------------------------
  // 본인 상품 조회
  async getUserProducts(userId: number) {
    return productRepository.findUserProducts(userId);
  }

  // 좋아요한 상품 조회
  async getUserLikedProducts(userId: number) {
    return productRepository.findLikedProducts(userId);
  }

  // 상품 좋아요
  async productLike(userId: number, productId: number) {
    const alreadyLiked = await productLikeRepository.exists(userId, productId);
    if (alreadyLiked) {
      throw new AppError('이미 좋아요를 눌렀습니다.', 400);
    }
    await productLikeRepository.create(userId, productId);
    const count = await productLikeRepository.count(productId);
    return { message: '좋아요 완료', likeCount: count };
  }

  // 상품 좋아요 취소
  async productUnlike(userId: number, productId: number) {
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
