import type { ArticleId, BaseArticleInput } from '@/types/article.types.js';
import type { Transaction } from '@/types/shared.types.js';
import { Prisma } from '@prisma/client';
import { UserId } from '@/types/user.types.js';

export interface ArticleParams extends UserId, ArticleId, Transaction {}

export interface PostArticleDTO extends UserId {
  data: BaseArticleInput;
}

export interface CreateDTO extends Transaction {
  createData: Prisma.ArticleCreateInput;
}

export interface PatchArticleDTO extends ArticleParams {
  data: Partial<BaseArticleInput>;
}

export interface UpdateDTO extends ArticleId, Transaction {
  patchData: Prisma.ArticleUpdateInput;
}

export interface ArticleIdWithTx extends ArticleId, Transaction {}
