import prisma from '../core/client/prismaClient.js';

export const commentService = {
  async getCommentById(commentId) {
    const comment = await prisma.comment.findUniqueOrThrow({
      where: { id: commentId },
    });
    return comment;
  },

  async updateComment(commentId, updateData) {
    const comment = await prisma.comment.update({
      where: { id: commentId },
      data: updateData,
    });
    return comment;
  },

  async deleteComment(commentId) {
    await prisma.comment.delete({
      where: { id: commentId },
    });
  },
};
