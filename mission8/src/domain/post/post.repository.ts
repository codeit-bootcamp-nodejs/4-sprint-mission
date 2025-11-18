import prisma from '../../utils/prisma.js';
import { createDataInput } from './post.type.js';

class PostRepository {
  findById = async (postId: number) => {
    return await prisma.post.findUnique({
      where: { id: postId },
    });
  };
  incrementCommentCount = async (postId: number) => {
    return await prisma.post.update({
      where: { id: postId },
      data: {
        commentCount: {
          increment: 1,
        },
      },
    });
  };
  create = async (createData: createDataInput) => {
    return await prisma.post.create({
      data: createData,
    });
  };
}

export const postRepository = new PostRepository();
