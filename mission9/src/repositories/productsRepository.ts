import { Product } from '@prisma/client';
import { prismaClient } from '../lib/prismaClient';
import { PagePaginationParams } from '../types/pagination';

export async function createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
  return prismaClient.product.create({
    data,
  });
}

export async function getProduct(id: number) {
  const product = await prismaClient.product.findUnique({
    where: { id },
  });
  return product;
}

export async function getProductWithFavorites(id: number, userId?: number) {
  const product = await prismaClient.product.findUnique({
    where: { id },
    include: { favorites: true },
  });
  if (!product) {
    return null;
  }

  const mappedProduct = {
    ...product,
    favorites: undefined,
    favoriteCount: product.favorites.length,
    isFavorited: userId
      ? product.favorites.some((favorite) => favorite.userId === userId)
      : undefined,
  };
  return mappedProduct;
}

export async function getProductListWithFavorites(
  { page, pageSize, orderBy, keyword }: PagePaginationParams,
  {
    userId,
  }: {
    userId?: number;
  } = {},
) {
  const where = keyword
    ? {
        OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }],
      }
    : {};

  const totalCount = await prismaClient.product.count({
    where,
  });

  const products = await prismaClient.product.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
    where,
    include: {
      favorites: true,
    },
  });

  const mappedProducts = products.map((product) => ({
    ...product,
    favorites: undefined,
    favoriteCount: product.favorites.length,
    isFavorited:
      userId !== undefined
        ? product.favorites.some((favorite) => favorite.userId === userId)
        : undefined,
  }));

  return {
    list: mappedProducts,
    totalCount,
  };
}

export async function getFavoriteProductListByOwnerId(
  ownerId: number,
  { page, pageSize, orderBy, keyword }: PagePaginationParams,
) {
  const where = keyword
    ? {
        OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }],
      }
    : {};
  const totalCount = await prismaClient.product.count({
    where: {
      ...where,
      favorites: {
        some: {
          userId: ownerId,
        },
      },
    },
  });
  const products = await prismaClient.product.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
    where: {
      ...where,
      favorites: {
        some: {
          userId: ownerId,
        },
      },
    },
    include: {
      favorites: true,
    },
  });

  const mappedProducts = products.map((product) => ({
    ...product,
    favorites: undefined,
    favoriteCount: product.favorites.length,
    isFavorited: true,
  }));

  return {
    list: mappedProducts,
    totalCount,
  };
}

export async function updateProductWithFavorites(id: number, data: Partial<Product>) {
  const product = await prismaClient.product.update({
    where: { id },
    data,
    include: {
      favorites: true,
    },
  });
  const mappedProduct = {
    ...product,
    favorites: undefined,
    favoriteCount: product.favorites.length,
    isFavorited: data.userId
      ? product.favorites.some((favorite) => favorite.userId === data.userId)
      : undefined,
  };
  return mappedProduct;
}

export async function deleteProduct(id: number) {
  return prismaClient.product.delete({
    where: { id },
  });
}
