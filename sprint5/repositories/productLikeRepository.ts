import prisma from "../lib/prisma.js";

export const productLikeReposioty = {
  findLike: (userId: number, productId: number) => {
    return prisma.like.findUnique({
      where: { userId_productId: { userId, productId } },
    });
  },

  createLike: (
    userId: number,
    productId: number
  ): Promise<{ userId: number; productId: number | null }> => {
    return prisma.like.create({
      data: { userId, productId, like: true },
      select: {
        userId: true,
        productId: true,
      },
    });
  },

  deleteLike: (userId: number, productId: number) => {
    return prisma.like.delete({
      where: { userId_productId: { userId, productId } },
    });
  },
};
