import prisma from "../lib/prisma.js";

export const toggleProductLike = async (userId, productId) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      const error = new Error("존재하지 않는 게시글입니다.");
      error.status = 400;
      throw error;
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });

      return { liked: false };
    } else {
      await prisma.like.create({
        data: {
          userId,
          productId,
          like: true,
        },
      });

      return { liked: true };
    }
  } catch (err) {
    throw err;
  }
};
