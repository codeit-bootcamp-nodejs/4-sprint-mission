export interface listProductCommentDto {
  commentId?: number;
  productId: number;
  cursor?: number;
  limit?: number;
}

export interface getProductCommentByIdDto {
  commentId: number;
  productId: number;
}

export interface createProductCommentDto {
  content: string;
  commentId?: number;
  productId: number;
}

export interface updateProductCommentDto {
  content: string;
  commentId: number;
  productId: number;
}

export interface deleteProductCommentDto {
  commentId: number;
  productId: number;
}
