import { ArticleId } from '@/types/article.types.js';
import { UserId } from '@/types/user.types.js';
import { Transaction } from '../types/shared.types.js';
import { Prisma } from '@prisma/client';

export interface GetCommentListParams extends ArticleId {
  cursorId?: number;
  pageSize: number;
}

export interface PostCommentDTO extends UserId, ArticleId {
  content: string;
}

export interface CreateDTO extends Transaction {
  createData: Prisma.ArticleCommentCreateInput;
}
