import prisma from '../../utils/prisma.js';
import type { CreateCommentInput } from './comment.type.js';

class CommentRepository {
  create = async (createData: CreateCommentInput) => {
    return prisma.postComment.create({
      data: {
        content: createData.content,
        userId: createData.userId,
        postId: createData.postId,
      },
    });
  };
}

export const commentRepository = new CommentRepository();
