import { Comment } from '@prisma/client';
import { prismaClient } from '../lib/prismaClient';
import { CursorPaginationParams } from '../types/pagination';

export async function createComment(data: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>) {
  const createdComment = await prismaClient.comment.create({
    data,
  });
  return createdComment;
}

export async function getComment(id: number) {
  const comment = await prismaClient.comment.findUnique({
    where: { id },
  });
  return comment;
}

export async function getCommentList(
  where: { articleId?: number; productId?: number },
  { cursor, limit }: CursorPaginationParams,
) {
  const commentsWithCursor = await prismaClient.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit + 1,
    where,
    orderBy: { createdAt: 'desc' },
  });
  const comments = commentsWithCursor.slice(0, limit);
  const cursorComment = commentsWithCursor[commentsWithCursor.length - 1];
  const nextCursor = cursorComment ? cursorComment.id : null;

  return {
    list: comments,
    nextCursor,
  };
}

export async function updateComment(id: number, data: Partial<Comment>) {
  return prismaClient.comment.update({
    where: { id },
    data,
  });
}

export async function deleteComment(id: number) {
  return prismaClient.comment.delete({
    where: { id },
  });
}
