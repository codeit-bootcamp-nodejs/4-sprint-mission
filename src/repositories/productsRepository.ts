import { prismaClient } from '../lib/prismaClient';
import Product from '../types/Product';
import { PagePaginationParams } from '../types/pagination';

export async function getProduct(id: number) {
  const product = await prismaClient.product.findUnique({
    where: { id },
  });
  return product;
}

export async function getProductWithFavorites(id: number, userId?: number): Promise<Product | null> {
  const product = await prismaClient.product.findUnique({
    where: { id },
    include: {
      _count: {
        select: { favorites: true },
      },
      favorites: userId ? { where: { userId } } : false,
    },
  });

  if (!product) return null;

  return {
    ...product,
    favoriteCount: product._count.favorites,
    isFavorited: userId ? product.favorites.length > 0 : false,
  };
}

export async function createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'favoriteCount' | 'isFavorited'>) {
  const product = await prismaClient.product.create({
    data,
  });
  return product;
}

export async function updateProduct(id: number, data: Partial<Product>) {
  const product = await prismaClient.product.update({
    where: { id },
    data,
  });
  return product;
}

export async function updateProductWithFavorites(id: number, data: Partial<Product>): Promise<Product> {
  const product = await prismaClient.product.update({
    where: { id },
    data,
    include: {
      _count: {
        select: { favorites: true },
      },
    },
  });

  return {
    ...product,
    favoriteCount: product._count.favorites,
    isFavorited: false,
  };
}

export async function deleteProduct(id: number) {
  await prismaClient.product.delete({
    where: { id },
  });
}

export async function getProductListWithFavorites(params: PagePaginationParams, options: { userId?: number }) {
  const { page, pageSize } = params;
  const skip = (page - 1) * pageSize;

  const products = await prismaClient.product.findMany({
    skip,
    take: pageSize,
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { favorites: true },
      },
      favorites: options.userId ? { where: { userId: options.userId } } : false,
    },
  });

  const totalCount = await prismaClient.product.count();

  return {
    list: products.map((p) => ({
      ...p,
      favoriteCount: p._count.favorites,
      isFavorited: options.userId ? p.favorites.length > 0 : false,
    })),
    totalCount,
  };
}
