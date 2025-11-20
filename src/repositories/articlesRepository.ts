import { prismaClient } from '../lib/prismaClient';
import Article from '../types/Article';

export async function getArticle(id: number) {
  const article = await prismaClient.article.findUnique({
    where: { id },
  });
  return article;
}

export async function createArticle(data: Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'likeCount' | 'isLiked'>) {
  const article = await prismaClient.article.create({
    data,
  });
  return article;
}

export async function updateArticle(id: number, data: Partial<Article>) {
  const article = await prismaClient.article.update({
    where: { id },
    data,
  });
  return article;
}

export async function deleteArticle(id: number) {
  await prismaClient.article.delete({
    where: { id },
  });
}
