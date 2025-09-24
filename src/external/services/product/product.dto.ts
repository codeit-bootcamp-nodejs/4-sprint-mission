// getProductList의 쿼리 파라미터 타입
export interface ProductListQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
  search?: string;
  [key: string]: any;
}

// API로부터 받는 상품 데이터의 타입
export interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
  favoriteCount: number;
}

// API로부터 받는 전자상품 데이터의 타입
export interface ElectronicProductData {
  id: string;
  manufacturer: string;
  name: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
  favoriteCount: number;
}

// 상품 생성을 위한 데이터 타입
export interface CreateProductDto {
  name: string;
  price: number;
  tags?: string[];
  image?: string[];
  description: string;
}

// 상품 수정을 위한 데이터 타입
export interface PatchProductDto {
  name?: string;
  price?: number;
  tags?: string[];
}

export interface ProductListResponse {
  list: ProductData[];
}
