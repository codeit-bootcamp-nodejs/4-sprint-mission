import prisma from '../index';
import { Like as PrismaLike, Prisma } from '@prisma/client';

class LikeRepository {
  async findLikeById(id: number): Promise<PrismaLike | null> {
    return prisma.like.findUnique({ where: { id } });
  }

  async findLikes(options?: {
    skip?: number;
    take?: number;
    where?: Prisma.LikeWhereInput;
    orderBy?: Prisma.LikeOrderByWithRelationInput;
  }): Promise<PrismaLike[]> {
    return prisma.like.findMany(options);
  }

  async createLike(data: Prisma.LikeCreateInput): Promise<PrismaLike> {
    return prisma.like.create({ data });
  }

  async deleteLike(id: number): Promise<PrismaLike> {
    return prisma.like.delete({ where: { id } });
  }

  async findLikeByUserIdAndProductId(
    userId: number,
    productId: number,
  ): Promise<PrismaLike | null> {
    return prisma.like.findFirst({
      where: { userId, productId },
    });
  }

  async findLikeByUserIdAndArticleId(
    userId: number,
    articleId: number,
  ): Promise<PrismaLike | null> {
    return prisma.like.findFirst({
      where: { userId, articleId },
    });
  }
}

export default LikeRepository;
