// src/repositories/productRepository.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const findAllProducts = async () => {
  return prisma.product.findMany({
    include: {
      user: { select: { id: true, nickname: true, image: true } },
      _count: { select: { likes: true, comments: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const findProductById = async (id: number) => {
  return prisma.product.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, nickname: true, image: true } },
      comments: {
        include: { user: { select: { id: true, nickname: true, image: true } } },
        orderBy: { createdAt: 'desc' },
      },
      _count: { select: { likes: true } },
    },
  });
};

export const findProductsByUserId = async (userId: number) => {
  return prisma.product.findMany({
    where: { userId },
    include: {
      user: { select: { id: true, nickname: true, image: true } },
      _count: { select: { likes: true, comments: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const findLikedProductsByUserId = async (userId: number) => {
  return prisma.productLike.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          user: { select: { id: true, nickname: true, image: true } },
          _count: { select: { likes: true, comments: true } },
        }
      }
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const createProduct = async (data: {
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
  userId: number
}) => {
  return prisma.product.create({ data });
};

export const updateProduct = async (
  id: number,
  data: {
    title?: string;
    description?: string | null;
    price?: number;
    imageUrl?: string | null;
  }
) => {
  return prisma.product.update({ where: { id }, data });
};

export const deleteProduct = async (id: number) => {
  return prisma.product.delete({ where: { id } });
};

export const findProductLike = async (userId: number, productId: number) => {
  return prisma.productLike.findUnique({
    where: {
      userId_productId: {
        userId,
        productId
      }
    }
  });
};

export const createProductLike = async (userId: number, productId: number) => {
  return prisma.productLike.create({
    data: { userId, productId }
  });
};

export const deleteProductLike = async (userId: number, productId: number) => {
  return prisma.productLike.delete({
    where: {
      userId_productId: {
        userId,
        productId
      }
    }
  });
};