import { ArticleId } from '@/types/article.types.js';
import { UserId } from '@/types/shared.type.js';

export interface GetCommentListParams extends ArticleId {
  cursorId?: number;
  pageSize: number;
}

export interface PostCommentDTO extends UserId, ArticleId {
  content: string;
}
