import { prismaClient } from '../lib/prismaClient';
import Comment from '../types/Comment';
import { CursorPaginationParams } from '../types/pagination';

export async function getComment(id: number) {
  const comment = await prismaClient.comment.findUnique({
    where: { id },
  });
  return comment;
}

export async function createComment(data: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>) {
  const comment = await prismaClient.comment.create({
    data,
  });
  return comment;
}

export async function getCommentList(
  where: { articleId?: number; productId?: number },
  params: CursorPaginationParams,
) {
  const { cursor, limit } = params;

  const commentsWithCursor = await prismaClient.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit + 1,
    where,
    orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
  });

  const list = commentsWithCursor.slice(0, limit);
  const cursorComment = commentsWithCursor[commentsWithCursor.length - 1];
  const nextCursor = cursorComment ? cursorComment.id : null;

  return { list, nextCursor };
}

export async function updateComment(id: number, data: Partial<Comment>) {
  const comment = await prismaClient.comment.update({
    where: { id },
    data,
  });
  return comment;
}

export async function deleteComment(id: number) {
  await prismaClient.comment.delete({
    where: { id },
  });
}
