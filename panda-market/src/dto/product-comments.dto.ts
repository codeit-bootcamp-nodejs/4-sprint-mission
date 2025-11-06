import { ProductId } from '@/types/product.types.js';
import { UserId } from '@/types/user.types.js';

export interface GetCommentListParams extends ProductId {
  cursorId?: number;
  pageSize: number;
}

export interface PostCommentDTO extends UserId, ProductId {
  content: string;
}
