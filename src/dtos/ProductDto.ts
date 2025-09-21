export interface ProductCreateDto {
  name: string;
  description: string;
  price: number;
}

export interface ProductUpdateDto {
  name?: string;
  description?: string;
  price?: number;
}
