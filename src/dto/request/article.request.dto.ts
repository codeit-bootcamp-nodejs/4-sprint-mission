export interface ArticleBodyDto {
  title: string;
  content: string;
}
export interface ArticleParamsDto {
  id: number;
}
export interface ArticleQueryDto {
  page?: number;
  pageSize?: number;
  keyword?: string[];
}
