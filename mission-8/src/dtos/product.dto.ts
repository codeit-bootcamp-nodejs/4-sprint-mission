export interface CreateProductDto {
  name: string;
  content: string;
  price?: number;
}

export interface UpdateProductDto {
  name?: string;
  content?: string;
  price?: number;
}
