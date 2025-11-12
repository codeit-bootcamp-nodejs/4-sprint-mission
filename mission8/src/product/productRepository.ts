import prisma from "../lib/prismaClient";

export const productRepository = {
  async updateProductPrice(productId: number, newPrice: number) {
    return await prisma.product.update({
      where: { id: productId },
      data: { price: newPrice },
    });
  },

  async findLikedUsers(productId: number) {
    return await prisma.favorite.findMany({
      where: { productId },
      select: { userId: true },
    });
  },
};
