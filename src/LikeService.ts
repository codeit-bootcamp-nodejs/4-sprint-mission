import { Like as PrismaLike, Prisma } from '@prisma/client';
import LikeRepository from './repositories/LikeRepository';

interface LikeCreateInput {
  userId: number;
  productId?: number;
  articleId?: number;
}

class LikeService {
  private likeRepository: LikeRepository;

  constructor(likeRepository: LikeRepository) {
    this.likeRepository = likeRepository;
  }

  async createLike(data: LikeCreateInput): Promise<PrismaLike> {
    const { userId, productId, articleId, ...rest } = data;
    return this.likeRepository.createLike({
      ...rest,
      user: { connect: { id: userId } },
      ...(productId && { product: { connect: { id: productId } } }),
      ...(articleId && { article: { connect: { id: articleId } } }),
    });
  }

  async deleteLike(id: number): Promise<PrismaLike> {
    return this.likeRepository.deleteLike(id);
  }

  async findLikeByUserIdAndProductId(
    userId: number,
    productId: number,
  ): Promise<PrismaLike | null> {
    return this.likeRepository.findLikeByUserIdAndProductId(userId, productId);
  }

  async findLikeByUserIdAndArticleId(
    userId: number,
    articleId: number,
  ): Promise<PrismaLike | null> {
    return this.likeRepository.findLikeByUserIdAndArticleId(userId, articleId);
  }

  async findLikes(options?: {
    skip?: number;
    take?: number;
    where?: Prisma.LikeWhereInput;
    orderBy?: Prisma.LikeOrderByWithRelationInput;
  }): Promise<PrismaLike[]> {
    return this.likeRepository.findLikes(options);
  }
}

export default LikeService;
