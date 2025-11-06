import type { ArticleLike, Prisma, ProductLike } from '@prisma/client';
import { UserId } from './user.types.js';

export interface EntityId {
  id: number;
}

export interface Likes {
  likes: ProductLike[] | ArticleLike[];
}

export interface Transaction {
  tx?: Prisma.TransactionClient;
}

export interface GetListParams extends UserId {
  keyword: string;
  page: number;
  pageSize: number;
}
export type Options = Omit<Prisma.UserFindUniqueOrThrowArgs, 'where'>;
