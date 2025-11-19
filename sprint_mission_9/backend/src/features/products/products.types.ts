export interface Product {
  id: number;
  seller_id: number;
  name: string;
  description: string;
  price: number;
  category_id?: number;
  image_url?: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface ProductWithCounts extends Product {
  seller_nickname?: string;
  like_count: number;
  comment_count: number;
}

export interface CreateProductDto {
  seller_id: number;
  name: string;
  description: string;
  price: number;
  category_id?: number;
  image_url?: string;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  category_id?: number;
  image_url?: string;
  status?: string;
}
