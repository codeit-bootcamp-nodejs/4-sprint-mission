import { PrismaClient, Prisma } from '@prisma/client';
import { ProductFilter, PaginationParams } from '../../shared/types/models';
import { CreateProductInput, UpdateProductInput } from './products.dto';

export class ProductsRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateProductInput) {
    return this.prisma.product.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            image: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });
  }

  async findById(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            image: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });
  }

  async findMany(filter: ProductFilter & PaginationParams) {
    const {
      page = 1,
      limit = 10,
      orderBy = 'createdAt',
      sortOrder = 'desc',
      userId,
      minPrice,
      maxPrice,
      tags,
      search,
    } = filter;

    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      ...(userId && { userId }),
      ...(minPrice !== undefined && { price: { gte: minPrice } }),
      ...(maxPrice !== undefined && { price: { ...{ lte: maxPrice } } }),
      ...(tags && tags.length > 0 && { tags: { hasSome: tags } }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [orderBy]: sortOrder },
        include: {
          user: {
            select: {
              id: true,
              nickname: true,
              image: true,
            },
          },
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

    return {
      data: products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: number, data: UpdateProductInput) {
    return this.prisma.product.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            image: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });
  }

  async delete(id: number) {
    return this.prisma.product.delete({
      where: { id },
    });
  }

  async isOwner(productId: number, userId: number): Promise<boolean> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { userId: true },
    });
    return product?.userId === userId;
  }

  // Like operations
  async checkLike(userId: number, productId: number): Promise<boolean> {
    const like = await this.prisma.like.findFirst({
      where: {
        userId,
        productId,
      },
    });
    return like !== null;
  }

  async addLike(userId: number, productId: number): Promise<void> {
    await this.prisma.like.create({
      data: {
        userId,
        productId,
      },
    });
  }

  async removeLike(userId: number, productId: number): Promise<void> {
    await this.prisma.like.deleteMany({
      where: {
        userId,
        productId,
      },
    });
  }
}
