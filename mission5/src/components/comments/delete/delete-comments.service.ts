import prisma from '@config/prisma.js';
import { AppError } from '@utils/app-error.js';

// 게시글 삭제
export const deleteCommentService = async ({
  commentId,
  userId,
}: {
  commentId: number;
  userId: number;
}) => {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });

  if (!comment) {
    throw new AppError('Comment not found', 404);
  }
  if (comment.authorId !== userId) {
    throw new AppError('Forbidden', 403);
  }

  await prisma.comment.delete({
    where: { id: commentId },
  });
};
