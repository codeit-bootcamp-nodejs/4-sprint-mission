import type { ParsedQs } from "qs";

export interface ProductBodyDto {
  name: string;
  description: string;
  price: string;
  tags?: string[];
}
export interface ProductParamsDto {
  id: string;
  [key: string]: string;
}
export interface ProductQueryDto extends ParsedQs {
  page?: string;
  pageSize?: string;
  keyword?: string[];
}
