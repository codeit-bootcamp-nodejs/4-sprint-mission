export interface listArticleCommentDto {
  commentId?: number;
  articleId: number;
  cursor?: number;
  limit?: number;
}

export interface getArticleCommentByIdDto {
  commentId: number;
  articleId: number;
}

export interface createArticleCommentDto {
  content: string;
  commentId?: number;
  articleId: number;
}

export interface updateArticleCommentDto {
  content: string;
  commentId: number;
  articleId: number;
}

export interface deleteArticleCommentDto {
  commentId: number;
  articleId: number;
}
