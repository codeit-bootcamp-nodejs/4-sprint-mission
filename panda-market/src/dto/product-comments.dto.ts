import { ProductId } from '@/types/product.types.js';
import { UserId } from '@/types/user.types.js';
import { Transaction } from '../types/shared.types.js';
import { Prisma } from '@prisma/client';

export interface GetCommentListParams extends ProductId {
  cursorId?: number;
  pageSize: number;
}

export interface PostCommentDTO extends UserId, ProductId {
  content: string;
}

export interface CreateDTO extends Transaction {
  createData: Prisma.ProductCommentCreateInput;
}
