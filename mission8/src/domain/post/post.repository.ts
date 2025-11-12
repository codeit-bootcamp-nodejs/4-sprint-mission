import prisma from '../../utils/prisma.js';

class PostRepository {
  findById = async (postId: number) => {
    return prisma.post.findUnique({
      where: { id: postId },
    });
  };
}

export const postRepository = new PostRepository();
