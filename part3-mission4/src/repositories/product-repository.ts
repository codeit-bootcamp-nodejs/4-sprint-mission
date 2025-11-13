import { prisma } from '../lib/prismaClient.js';
import type { Prisma } from '@prisma/client';
import type { ProductWithRelations } from '../types/product-types.js';

class ProductRepository {
  async findMany(
    args: Prisma.ProductFindManyArgs
  ): Promise<ProductWithRelations[]> {
    return prisma.product.findMany(args) as Promise<ProductWithRelations[]>;
  }

  async findUnique(productId: number, userId?: number) {
    return prisma.product.findUnique({
      where: { id: productId },
      include: {
        user: { select: { username: true } },
        comments: {
          include: {
            user: { select: { username: true } },
          },
        },
        ...(userId && {
          likes: { where: { userId }, select: { userId: true } }, // ✅ 유저가 좋아요 했는지 확인
        }),
      },
    });
  }

  async create(data: {
    name: string;
    description: string;
    price: number;
    tags: string[];
    userId: number;
  }) {
    return prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        tags: data.tags,
        user: { connect: { id: data.userId } },
      },
    });
  }

  async update(
    productId: number,
    userId: number,
    updateData: Record<string, any>
  ) {
    return prisma.product.update({
      where: { id: productId, userId },
      data: updateData,
    });
  }

  async delete(productId: number, userId: number) {
    return prisma.product.deleteMany({ where: { id: productId, userId } });
  }

  async count(where?: Prisma.ProductWhereInput) {
    return prisma.product.count({ where: where ?? {} });
  }

  async findUserProducts(userId: number) {
    return prisma.product.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
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

  async findLikedProducts(userId: number) {
    return prisma.product.findMany({
      where: {
        likes: { some: { userId } },
      },
    });
  }

  async countByProductIds(productIds: number[]) {
    return prisma.productLike.groupBy({
      by: ['productId'],
      _count: { productId: true },
      where: { productId: { in: productIds } },
    });
  }

  async findByUserAndProductIds(userId: number, productIds: number[]) {
    return prisma.productLike.findMany({
      where: { userId, productId: { in: productIds } },
      select: { productId: true },
    });
  }
}

export const productRepository = new ProductRepository();
