import { Favorite } from '@prisma/client';
import { prismaClient } from '../lib/prismaClient';

export async function createFavorite(data: Omit<Favorite, 'id' | 'createdAt' | 'updatedAt'>) {
  const createdFavorite = await prismaClient.favorite.create({
    data,
  });
  return createdFavorite;
}

export async function getFavorite(productId: number, userId: number) {
  const favorite = await prismaClient.favorite.findFirst({
    where: { productId, userId },
  });
  return favorite;
}

export async function deleteFavorite(id: number) {
  await prismaClient.favorite.delete({
    where: { id },
  });
}
