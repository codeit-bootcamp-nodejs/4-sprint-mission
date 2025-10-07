import { prisma } from '../lib/prismaClient.js';

// Like 모델들
type LikeModels = 'articleLike' | 'productLike' | 'commentLike';

// 각 모델별 대상 키
type TargetIdKey<M extends LikeModels> = M extends 'articleLike'
  ? 'articleId'
  : M extends 'productLike'
  ? 'productId'
  : 'commentId';

// 각 모델별 groupBy 반환 타입
type GroupByResult<M extends LikeModels> = {
  [K in TargetIdKey<M>]: number;
} & {
  _count: { [K in TargetIdKey<M>]: number };
};

// 각 모델별 "내가 좋아요한 대상" findMany 반환 타입
type UserLikeResult<M extends LikeModels> = {
  [K in TargetIdKey<M>]: number;
};

// 각 모델별 복합키 이름
type CompositeKey<M extends LikeModels> = M extends 'articleLike'
  ? 'userId_articleId'
  : M extends 'productLike'
  ? 'userId_productId'
  : 'userId_commentId';

export class LikeRepository<M extends LikeModels> {
  constructor(private model: M) {}

  async create(userId: number, targetId: number) {
    const targetKey = this.getTargetKey();
    return (prisma as any)[this.model].create({
      data: { userId, [targetKey]: targetId },
    });
  }

  async delete(userId: number, targetId: number) {
    const targetKey = this.getTargetKey();
    const compositeKey = this.getCompositeKey();
    return (prisma as any)[this.model].delete({
      where: { [compositeKey]: { userId, [targetKey]: targetId } },
    });
  }

  async count(targetId: number) {
    const targetKey = this.getTargetKey();
    return (prisma as any)[this.model].count({
      where: { [targetKey]: targetId },
    });
  }

  async exists(userId: number, targetId: number): Promise<boolean> {
    const targetKey = this.getTargetKey();
    const compositeKey = this.getCompositeKey();
    const record = await (prisma as any)[this.model].findUnique({
      where: { [compositeKey]: { userId, [targetKey]: targetId } },
    });
    return !!record;
  }

  // ✅ 여러 대상의 좋아요 수 집계
  async countByTargetIds(targetIds: number[]): Promise<GroupByResult<M>[]> {
    const targetKey = this.getTargetKey();
    return (prisma as any)[this.model].groupBy({
      by: [targetKey],
      _count: { [targetKey]: true },
      where: { [targetKey]: { in: targetIds } },
    });
  }

  // ✅ 특정 유저가 좋아요한 대상들
  async findByUserAndTargetIds(
    userId: number,
    targetIds: number[]
  ): Promise<UserLikeResult<M>[]> {
    const targetKey = this.getTargetKey();
    return (prisma as any)[this.model].findMany({
      where: { userId, [targetKey]: { in: targetIds } },
      select: { [targetKey]: true },
    });
  }

  // 내부 키 헬퍼
  private getTargetKey(): TargetIdKey<M> {
    if (this.model === 'articleLike') return 'articleId' as TargetIdKey<M>;
    if (this.model === 'productLike') return 'productId' as TargetIdKey<M>;
    return 'commentId' as TargetIdKey<M>;
  }

  private getCompositeKey(): CompositeKey<M> {
    if (this.model === 'articleLike')
      return 'userId_articleId' as CompositeKey<M>;
    if (this.model === 'productLike')
      return 'userId_productId' as CompositeKey<M>;
    return 'userId_commentId' as CompositeKey<M>;
  }
}

// 인스턴스
export const articleLikeRepository = new LikeRepository('articleLike');
export const productLikeRepository = new LikeRepository('productLike');
export const commentLikeRepository = new LikeRepository('commentLike');
