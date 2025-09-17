import type { ParsedQs } from "qs";

export interface ArticleBodyDto {
  title: string;
  content: string;
}
export interface ArticleParamsDto {
  id: string;
}
export interface ArticleQueryDto extends ParsedQs {
  page?: string;
  pageSize?: string;
  keyword?: string[];
}
