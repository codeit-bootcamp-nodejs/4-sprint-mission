import prisma from '../../utils/prisma.js';

class CommentRepository {
  create = async (content: string, userId: number, postId: number) => {
    return prisma.postComment.create({
      data: {
        content: content,
        userId: userId,
        postId: postId,
      },
    });
  };
}

export const commentRepository = new CommentRepository();
