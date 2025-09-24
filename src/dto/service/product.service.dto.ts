export interface listProductDto {
  page?: number;
  pageSize?: number;
  keyword?: string[];
}

export interface getProductByIdDto {
  id: number;
}

export interface createProductDto {
  name: string;
  description: string;
  price: number;
  tags?: string[];
  userId: number;
}

export interface updateProductDto {
  name: string;
  description: string;
  price: number;
  tags?: string[];
  id: number;
}

export interface deleteProductDto {
  id: number;
}

export interface toggleProductLikeDto {
  userId: number;
  id: number;
}
