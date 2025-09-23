import prisma from '@config/prisma.js';
import { AppError } from '@utils/app-error.js';
import type { UpdateCommentDto } from './update-comments.dto.js';

export async function updateCommentService(input: UpdateCommentDto) {
  const { commentId, userId, content } = input;

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) throw new AppError('Comment not found', 404);
  if (comment.authorId !== userId) throw new AppError('Forbidden', 403);

  return prisma.comment.update({
    where: { id: commentId },
    data: { content },
  });
}
