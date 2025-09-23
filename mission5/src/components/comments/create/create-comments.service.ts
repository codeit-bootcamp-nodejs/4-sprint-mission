import prisma from '@config/prisma.js';
import { AppError } from '@utils/app-error.js';
import type { CreateCommentDto } from './create-comments.dto.js';

export async function createCommentService(input: CreateCommentDto) {
  const { content, authorId, articleId, productId } = input;

  if (!content?.trim()) {
    throw new AppError('Content cannot be empty', 400);
  }

  const data = {
    content,
    author: { connect: { id: authorId } },
    ...(articleId ? { article: { connect: { id: articleId } } } : {}),
    ...(productId ? { product: { connect: { id: productId } } } : {}),
  } as const;

  return prisma.comment.create({
    data,
    select: {
      id: true,
      content: true,
      authorId: true,
      articleId: true,
      productId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
