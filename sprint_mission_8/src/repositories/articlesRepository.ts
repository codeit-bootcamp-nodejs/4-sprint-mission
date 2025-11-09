import { Article } from '@prisma/client';
import { prismaClient } from '../lib/prismaClient';
import { PagePaginationParams } from '../types/pagination';

export async function createArticle(data: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>) {
  const createdArticle = await prismaClient.article.create({
    data,
  });
  return createdArticle;
}

export async function getArticle(id: number) {
  const article = await prismaClient.article.findUnique({ where: { id } });
  return article;
}

export async function getArticleWithLkes(id: number, { userId }: { userId?: number } = {}) {
  const article = await prismaClient.article.findUnique({
    where: { id },
    include: {
      likes: true,
    },
  });

  if (!article) {
    return null;
  }

  return {
    ...article,
    likes: undefined,
    likeCount: article.likes.length,
    isLiked: userId ? article.likes.some((like) => like.userId === userId) : undefined,
  };
}

export async function getArticleListWithLikes(
  { page, pageSize, orderBy, keyword }: PagePaginationParams,
  {
    userId,
  }: {
    userId?: number;
  } = {},
) {
  const where = {
    title: keyword ? { contains: keyword } : undefined,
  };

  const totalCount = await prismaClient.article.count({ where });
  const articles = await prismaClient.article.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : { id: 'asc' },
    where,
    include: {
      likes: true,
    },
  });

  const mappedArticles = articles.map((article) => ({
    ...article,
    likes: undefined,
    likeCount: article.likes.length,
    isLiked: userId ? article.likes.some((like) => like.userId === userId) : undefined,
  }));

  return {
    list: mappedArticles,
    totalCount,
  };
}

export async function updateArticleWithLikes(id: number, data: Partial<Article>) {
  const updatedArticle = await prismaClient.article.update({
    where: { id },
    data,
    include: {
      likes: true,
    },
  });
  return {
    ...updatedArticle,
    likeCount: updatedArticle.likes.length,
    isLiked: data.userId
      ? updatedArticle.likes.some((like) => like.userId === data.userId)
      : undefined,
  };
}

export async function deleteArticle(id: number) {
  return prismaClient.article.delete({
    where: { id },
  });
}
