import prisma from "../lib/prisma";
import type { Product } from "../types/dto";

export const productRepository = {
  getProducts: async (
    offset: number,
    limit: number,
    name: string | undefined,
    description: string | undefined
  ): Promise<Product[]> => {
    const filter = [];

    if (name) {
      filter.push({ name: { contains: name } });
    }

    if (description) {
      filter.push({ description: { contains: description } });
    }

    const where = filter.length > 0 ? { OR: filter } : {};

    return await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        createdAt: true,
      },
    });
  },

  createProduct: async (
    name: string,
    description: string,
    price: number,
    tags: string[],
    userId: number
  ): Promise<Product> => {
    return await prisma.product.create({
      data: {
        name,
        description,
        price,
        tags,
        userId,
      },
    });
  },

  getProductById: async (id: number): Promise<Product | null> => {
    return await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tags: true,
        createdAt: true,
        userId: true,
      },
    });
  },

  updateProduct: async (
    id: number,
    name?: string | undefined,
    description?: string | undefined,
    price?: number | undefined,
    tags?: string[] | undefined
  ): Promise<Product> => {
    return await prisma.product.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price }),
        ...(tags !== undefined && { tags }),
      },
    });
  },

  deleteProduct: async (id: number): Promise<void> => {
    await prisma.product.delete({ where: { id } });
  },

  findLikedProducts: async (userId: number, productIds: number[]) => {
    return await prisma.like.findMany({
      where: {
        userId,
        productId: { in: productIds },
      },
      select: {
        productId: true,
        userId: true,
      },
    });
  },
};
