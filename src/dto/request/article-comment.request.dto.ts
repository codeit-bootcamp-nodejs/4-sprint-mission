export interface ArticleCommentBodyDto {
  content: string;
}
export interface ArticleCommentParamsDto {
  commentId?: string;
  articleId: string;
}
export interface ArticleCommentQueryDto {
  cursor?: string;
  limit?: string;
}
