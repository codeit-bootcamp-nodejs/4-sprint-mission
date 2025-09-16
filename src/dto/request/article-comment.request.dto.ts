export interface ArticleCommentBodyDto {
  content: string;
}
export interface ArticleCommentParamsDto {
  commentId?: number;
  articleId: number;
}
export interface ArticleCommentQueryDto {
  cursor?: number;
  limit?: number;
}
