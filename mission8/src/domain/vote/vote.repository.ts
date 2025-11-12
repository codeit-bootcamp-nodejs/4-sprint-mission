import prisma from '../../utils/prisma.js';

class VoteRepository {
  findByProductId = async (productId: number) => {
    return prisma.productVote.findMany({
      where: { productId: productId },
      select: { userId: true },
    });
  };
}

export const voteRepository = new VoteRepository();
