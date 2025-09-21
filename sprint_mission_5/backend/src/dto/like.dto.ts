export interface CreateLikeDto {
  userId: number;
  productId?: number;
  articleId?: number;
}

export interface LikeResponseDto {
  id: number;
  userId: number;
  productId?: number | null;
  articleId?: number | null;
  createdAt: Date;
}