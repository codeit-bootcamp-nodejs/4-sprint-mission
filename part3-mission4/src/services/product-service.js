import prisma from '../lib/prismaClient.js';
import AppError from '../lib/appError.js';

class ProductService {
  // 전체 상품 조회 (검색/페이징/정렬)
  async getAllProducts(query, userId) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const sort = query.sort || 'recent';
    const keyword = query.keyword || '';
    const skip = (page - 1) * limit;

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

    const where = keyword
      ? {
          OR: [
            { name: { contains: keyword, mode: 'insensitive' } },
            { description: { contains: keyword, mode: 'insensitive' } },
          ],
        }
      : {};

    const include = {
      user: { select: { username: true } },
    };

    if (userId) {
      include.likedBy = {
        where: { id: userId },
        select: { id: true, username: true },
      };
    }

    const products = await prisma.product.findMany({
      skip,
      take: limit,
      where,
      orderBy,
      include,
    });

    if (!products) {
      throw new AppError('해당하는 제품을 찾을 수 없습니다.', 404);
    }

    const productsWithLike = products.map((p) => ({
      ...p,
      isLiked: userId ? p.likedBy?.length > 0 : false,
      likeCount: p.likeCount, // likeCount 필드 사용
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
      where: { id: parseInt(productId) },
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

  // 상품 수정 (권한 체크 포함)
  async updateProduct(productId, userId, updateData) {
    const updated = await prisma.product.updateMany({
      where: { id: parseInt(productId), userId },
      data: updateData,
    });

    if (updated.count === 0) {
      throw new AppError('권한이 없거나 제품이 존재하지 않습니다.', 403);
    }

    return prisma.product.findUnique({
      where: { id: parseInt(productId) },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tags: true,
        images: true,
      },
    });
  }

  // 상품 삭제 (권한 체크 포함)
  async deleteProduct(productId, userId) {
    const deleted = await prisma.product.deleteMany({
      where: { id: parseInt(productId), userId },
    });

    if (deleted.count === 0) {
      throw new AppError('권한이 없거나 제품이 존재하지 않습니다.', 403);
    }

    return { message: '제품이 삭제되었습니다.' };
  }

  // 특정 유저의 상품 조회
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

  async getUserLikedProducts(userId) {
    const likedProducts = await prisma.product.findMany({
      where: { likedBy: { some: { id: parseInt(userId) } } },
    });
    return likedProducts;
  }

  async productLike(userId, productId) {
    console.log('productId:', productId, 'userId:', userId);
    const productLiked = await prisma.product.update({
      where: { id: parseInt(productId) },
      data: {
        likedBy: { connect: { id: parseInt(userId) } },
        likeCount: { increment: 1 },
      },
    });
    return productLiked;
  }

  async productUnlike(userId, productId) {
    const productUnliked = await prisma.product.update({
      where: { id: parseInt(productId) },
      data: {
        likedBy: { disconnect: { id: parseInt(userId) } },
        likeCount: { decrement: 1 },
      },
    });
    return productUnliked;
  }
}

export const productService = new ProductService();
