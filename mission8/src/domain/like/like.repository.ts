import prisma from '../../utils/prisma.js';

class LikeRepository {
  findByProductId = async (productId: number) => {
    return await prisma.productLike.findMany({
      where: { productId: productId },
      select: { userId: true },
    });
  };
}

export const likeRepository = new LikeRepository();
