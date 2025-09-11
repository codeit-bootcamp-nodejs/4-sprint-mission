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
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tags: true,
        images: true,
        userId: true,
        likeCount: true,
        ...(userId && {
          likedBy: { where: { id: userId }, select: { id: true } },
        }),
        comments: {
          select: {
            id: true,
            content: true,
            likeCount: true,
            ...(userId && {
              likedBy: { where: { id: userId }, select: { id: true } },
            }),
          },
        },
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
      where: { id: productId },
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
        likeCount: true,
        likedBy: true,
      },
    });
  }

  async findLikedProducts(userId: number) {
    return prisma.product.findMany({
      where: { likedBy: { some: { id: userId } } },
    });
  }

  async likeProduct(userId: number, productId: number) {
    return prisma.product.update({
      where: { id: productId },
      data: {
        likedBy: { connect: { id: userId } },
        likeCount: { increment: 1 },
      },
    });
  }

  async unlikeProduct(userId: number, productId: number) {
    return prisma.product.update({
      where: { id: productId },
      data: {
        likedBy: { disconnect: { id: userId } },
        likeCount: { decrement: 1 },
      },
    });
  }
}

export const productRepository = new ProductRepository();
