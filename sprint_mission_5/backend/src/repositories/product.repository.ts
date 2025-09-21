import { PrismaClient } from '@prisma/client';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductResponseDto,
  ProductWithCountsDto,
  ProductQueryDto,
} from '../dto/index.js';

export class ProductRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateProductDto): Promise<ProductResponseDto> {
    return await this.prisma.product.create({
      data,
    });
  }

  async findById(id: number): Promise<ProductResponseDto | null> {
    return await this.prisma.product.findUnique({
      where: { id },
    });
  }

  async findByIdWithCounts(id: number): Promise<ProductWithCountsDto | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    if (!product) return null;

    const { _count, ...productData } = product;
    return {
      ...productData,
      likeCount: _count.likes,
      commentCount: _count.comments,
    };
  }

  async findMany(
    query: ProductQueryDto,
    userId?: number,
  ): Promise<{
    products: ProductWithCountsDto[];
    totalCount: number;
  }> {
    const { page = 1, pageSize = 10, orderBy = 'recent', keyword } = query;
    const skip = (page - 1) * pageSize;

    const where = keyword
      ? {
          OR: [
            { name: { contains: keyword, mode: 'insensitive' as const } },
            {
              description: { contains: keyword, mode: 'insensitive' as const },
            },
          ],
        }
      : {};

    const orderByClause =
      orderBy === 'favorite'
        ? { likes: { _count: 'desc' as const } }
        : { createdAt: 'desc' as const };

    const [products, totalCount] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: orderByClause,
        include: {
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    const productsWithCounts = products.map((product) => {
      const { _count, ...productData } = product;
      return {
        ...productData,
        likeCount: _count.likes,
        commentCount: _count.comments,
      };
    });

    return {
      products: productsWithCounts,
      totalCount,
    };
  }

  async update(
    id: number,
    data: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    return await this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    });
  }

  async checkOwnership(id: number, userId: number): Promise<boolean> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: { userId: true },
    });
    return product?.userId === userId;
  }

  async findByUserId(userId: number): Promise<{ list: ProductResponseDto[]; totalCount: number }> {
    const products = await this.prisma.product.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const productsWithCounts = await Promise.all(
      products.map(async (product) => ({
        ...product,
        likeCount: await this.prisma.like.count({
          where: { productId: product.id },
        }),
        commentCount: await this.prisma.comment.count({
          where: { productId: product.id },
        }),
        isLiked: false, // 자신의 상품이므로 기본적으로 false
      })),
    );

    return {
      list: productsWithCounts,
      totalCount: products.length,
    };
  }

  async findLikedByUserId(userId: number): Promise<{ list: ProductResponseDto[]; totalCount: number }> {
    const likedProducts = await this.prisma.like.findMany({
      where: {
        userId,
        productId: { not: null }
      },
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const productsWithCounts = await Promise.all(
      likedProducts.map(async (like) => {
        const product = like.product!;
        return {
          ...product,
          likeCount: await this.prisma.like.count({
            where: { productId: product.id },
          }),
          commentCount: await this.prisma.comment.count({
            where: { productId: product.id },
          }),
          isLiked: true, // 좋아요한 상품이므로 true
        };
      }),
    );

    return {
      list: productsWithCounts,
      totalCount: likedProducts.length,
    };
  }
}
