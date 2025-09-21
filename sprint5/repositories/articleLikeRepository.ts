import prisma from "../lib/prisma.js";

export const aritcleLikeReposioty = {
  findLike: (userId: number, articleId: number) => {
    return prisma.like.findUnique({
      where: { userId_articleId: { userId, articleId } },
    });
  },

  createLike: (
    userId: number,
    articleId: number
  ): Promise<{ userId: number; articleId: number | null }> => {
    return prisma.like.create({
      data: { userId, articleId, like: true },
      select: {
        userId: true,
        articleId: true,
      },
    });
  },

  deleteLike: (userId: number, articleId: number) => {
    return prisma.like.delete({
      where: { userId_articleId: { userId, articleId } },
    });
  },
};
