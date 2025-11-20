import { prismaClient } from '../lib/prismaClient';

export async function getFavoritesByProductId(productId: number) {
  const favorites = await prismaClient.favorite.findMany({
    where: { productId },
  });
  return favorites;
}

export async function getFavoriteByUserAndProduct(userId: number, productId: number) {
  const favorite = await prismaClient.favorite.findFirst({
    where: { userId, productId },
  });
  return favorite;
}

export async function createFavorite(userId: number, productId: number) {
  const favorite = await prismaClient.favorite.create({
    data: { userId, productId },
  });
  return favorite;
}

export async function deleteFavorite(userId: number, productId: number) {
  await prismaClient.favorite.deleteMany({
    where: { userId, productId },
  });
}
