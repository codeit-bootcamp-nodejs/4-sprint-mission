import prisma from '../../utils/prisma.js';

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
}

export const postRepository = new PostRepository();
