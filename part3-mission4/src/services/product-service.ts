import { Prisma } from '@prisma/client';
import { productRepository } from '../repositories/product-repository.js';
import type { ProductQuery, ProductById } from '../types/product-types.js';
import AppError from '../lib/appError.js';

class ProductService {
  // 전체 상품 조회
  async getAllProducts(query: ProductQuery, userId?: number) {
    const page = query.page || 1;
    const limit = query.limit || 10;
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
        likedBy: { select: { id: true, username: true } },
        comments: {
          include: { likedBy: true, user: { select: { username: true } } },
        },
      },
    });

    if (!products || products.length === 0)
      throw new AppError('제품 없음', 404);

    const productsWithLike = products.map((p) => ({
      ...p,
      isLiked: userId ? (p.likedBy?.length ?? 0) > 0 : false,
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

    const productWithLike = {
      ...product,
      isLiked: userId ? product.likedBy.length > 0 : false,
      comments: product.comments?.map((c) => ({
        ...c,
        isLiked: userId ? (c.likedBy.length ?? 0) > 0 : false,
      })),
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

  async updateProduct(
    productId: number,
    userId: number,
    updateData: Record<string, any>
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
    return productRepository.likeProduct(userId, productId);
  }

  // 상품 좋아요 취소
  async productUnlike(userId: number, productId: number) {
    return productRepository.unlikeProduct(userId, productId);
  }
}

export const productService = new ProductService();
