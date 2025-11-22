import { prisma } from '../utils/prisma.util.js';
import { Prisma } from '@prisma/client';

export class CommentsRepository {
  constructor() {}

  findArticleById = async (articleId: number) => {
    return prisma.article.findUnique({ where: { id: articleId } });
  };

  createArticleComment = async (
    userId: number,
    articleId: number,
    content: string,
  ) => {
    return prisma.comment.create({
      data: {
        content,
        authorId: userId,
        articleId: articleId,
      },
    });
  };

  findProductById = async (productId: number) => {
    return prisma.product.findUnique({ where: { id: productId } });
  };

  createProductComment = async (
    userId: number,
    productId: number,
    content: string,
  ) => {
    return prisma.comment.create({
      data: {
        content,
        authorId: userId,
        productId: productId,
      },
    });
  };

  findCommentsByArticleId = async (articleId: number) => {
    return prisma.comment.findMany({
      where: { articleId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, content: true, createdAt: true, updatedAt: true, author: { select: { nickname: true } } },
    });
  };

  findCommentsByProductId = async (productId: number) => {
    return prisma.comment.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, content: true, createdAt: true, updatedAt: true, author: { select: { nickname: true } } },
    });
  };

  findCommentById = async (commentId: number) => {
    return prisma.comment.findUnique({ where: { id: commentId } });
  };

  updateComment = async (commentId: number, content: string) => {
    return prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });
  };

  deleteComment = async (commentId: number) => {
    return prisma.comment.delete({ where: { id: commentId } });
  };
}
