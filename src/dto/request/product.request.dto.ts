export interface ProductBodyDto {
  name: string;
  description: string;
  price: number;
  tags?: string[];
}
export interface ProductParamsDto {
  id: number;
}
export interface ProductQueryDto {
  page?: number;
  pageSize?: number;
  keyword?: string[];
}
