export interface ProductCommentBodyDto {
  content: string;
}
export interface ProductCommentParamsDto {
  commentId?: number;
  productId: number;
}
export interface ProductCommentQueryDto {
  cursor?: number;
  limit?: number;
}
