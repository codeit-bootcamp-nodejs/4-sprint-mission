import prisma from "../lib/prisma";

export const likeRepository = {
  getUsersWhoLikedProduct: async (id: number) => {
    return await prisma.like.findMany({
      where: {
        productId: id,
        like: true,
      },
      select: {
        user: true,
      },
    });
  },
};
