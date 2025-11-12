import { Like } from '@prisma/client';
import { prismaClient } from '../lib/prismaClient';

export async function createLike(data: Omit<Like, 'id' | 'createdAt' | 'updatedAt'>) {
  const createdLike = await prismaClient.like.create({
    data,
  });
  return createdLike;
}

export async function getLike(articleId: number, userId: number) {
  const like = await prismaClient.like.findFirst({
    where: { articleId, userId },
  });
  return like;
}

export async function deleteLike(id: number) {
  await prismaClient.like.delete({
    where: { id },
  });
}
