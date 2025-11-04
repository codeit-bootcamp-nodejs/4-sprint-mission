import type { Prisma } from '@prisma/client';

export type Content = 'products' | 'articles' | 'comments';
export type SingleContent = 'product' | 'article' | 'comment';

export type ParentContentType = Exclude<Content, 'comments'>;
export type SingularContentType = Exclude<SingleContent, 'comment'>;

export interface EntityId {
  id: number;
}
export interface UserId {
  userId: number;
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
