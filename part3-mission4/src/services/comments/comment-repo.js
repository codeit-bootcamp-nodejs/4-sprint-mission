import prisma from '../../lib/prismaClient.js';
import AppError from '../../lib/appError.js';

export const commentRepository = {
  async findById(commentId) {
    return prisma.comment.findUnique({ where: { id: parseInt(commentId) } });
  },

  // 댓글 수정
  async updateComment(commentId, userId, content) {
    const comment = await this.findById(commentId);
    if (!comment) throw new AppError('댓글을 찾을 수 없습니다.', 404);
    if (comment.userId !== userId) throw new AppError('권한이 없습니다.', 403);

    return prisma.comment.update({
      where: { id: parseInt(commentId) },
      data: { content },
    });
  },

  // 댓글 삭제
  async deleteComment(commentId, userId) {
    const deleted = await prisma.comment.deleteMany({
      where: { id: parseInt(commentId), userId },
    });
    if (deleted.count === 0)
      throw new AppError('권한이 없거나 댓글이 존재하지 않습니다.', 403);

    return { message: '댓글이 삭제되었습니다.' };
  },

// 댓글 좋아요
async like(userId, commentId) {
  const alreadyLiked = await prisma.comment.findFirst({
    where: {
      id: parseInt(commentId),
      likedBy: { some: { id: parseInt(userId) } },
    },
  });

  if (alreadyLiked) {
    throw new AppError('이미 좋아요한 댓글입니다.', 400);
  }

  const [updated] = await prisma.$transaction([
    prisma.comment.update({
      where: { id: parseInt(commentId) },
      data: { likedBy: { connect: { id: parseInt(userId) } } },
    }),
    prisma.comment.update({
      where: { id: parseInt(commentId) },
      data: { likeCount: { increment: 1 } },
    }),
  ]);

  return updated;
},

// 댓글 좋아요 취소
async unlike(userId, commentId) {
  const alreadyLiked = await prisma.comment.findFirst({
    where: {
      id: parseInt(commentId),
      likedBy: { some: { id: parseInt(userId) } },
    },
  });

  if (!alreadyLiked) {
    throw new AppError('좋아요한 기록이 없습니다.', 400);
  }

  const [updated] = await prisma.$transaction([
    prisma.comment.update({
      where: { id: parseInt(commentId) },
      data: { likedBy: { disconnect: { id: parseInt(userId) } } },
    }),
    prisma.comment.update({
      where: { id: parseInt(commentId) },
      data: { likeCount: { decrement: 1 } },
    }),
  ]);

  return updated;
  },
};
