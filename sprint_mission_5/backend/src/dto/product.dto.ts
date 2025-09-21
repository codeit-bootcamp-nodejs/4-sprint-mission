export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  tags: string[];
  imageUrl?: string;
  userId: number;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  tags?: string[];
  imageUrl?: string;
}

export interface ProductResponseDto {
  id: number;
  name: string;
  description: string;
  price: number;
  tags: string[];
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
}

export interface ProductWithCountsDto extends ProductResponseDto {
  likeCount: number;
  commentCount: number;
}

export interface ProductWithLikeStatusDto extends ProductWithCountsDto {
  isLiked: boolean;
}

export interface ProductListResponseDto {
  list: ProductWithLikeStatusDto[];
  totalCount: number;
}

export interface ProductQueryDto {
  page?: number;
  pageSize?: number;
  orderBy?: 'recent' | 'favorite';
  keyword?: string;
}