export interface CreateCommentDto {
  content: string;
  userId: number;
  productId?: number;
  articleId?: number;
}

export interface UpdateCommentDto {
  content: string;
}

export interface CommentResponseDto {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  productId?: number | null;
  articleId?: number | null;
  user?: {
    id: number;
    nickname: string;
    image?: string | null;
  };
}

export interface CommentListResponseDto {
  list: CommentResponseDto[];
  totalCount: number;
}

export interface CommentQueryDto {
  limit?: number;
  cursor?: number;
}