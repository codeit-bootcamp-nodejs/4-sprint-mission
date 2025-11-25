import type { ArticleLike, Prisma, ProductLike } from '@prisma/client';

export interface EntityId {
  id: number;
}

export interface Likes {
  likes: ProductLike[] | ArticleLike[];
}

export interface Transaction {
  tx?: Prisma.TransactionClient;
}

export interface GetListParams {
  userId?: number;
  keyword: string;
  page: number;
  pageSize: number;
  orderBy: string;
}
