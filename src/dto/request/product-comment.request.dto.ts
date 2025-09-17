export interface ProductCommentBodyDto {
  content: string;
}
export interface ProductCommentParamsDto {
  commentId?: string;
  productId: string;
}
export interface ProductCommentQueryDto {
  cursor?: string;
  limit?: string;
}
