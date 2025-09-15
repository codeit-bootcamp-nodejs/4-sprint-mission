// Common types and interfaces
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  tags: string[];
  imageUrl?: string;
  favoriteCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  image?: string;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: number;
  content: string;
  productId?: number;
  articleId?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  tags: string[];
  imageUrl?: string;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  tags?: string[];
  imageUrl?: string;
}

export interface CreateArticleRequest {
  title: string;
  content: string;
  image?: string;
}

export interface UpdateArticleRequest {
  title?: string;
  content?: string;
  image?: string;
}

export interface CreateCommentRequest {
  content: string;
}

export interface UpdateCommentRequest {
  content: string;
}

export interface PaginationQuery {
  page?: string;
  pageSize?: string;
  orderBy?: string;
  keyword?: string;
}

export interface ApiResponse<T> {
  list?: T[];
  currentPage?: number;
  totalCount?: number;
  data?: T;
}

export interface ErrorResponse {
  message: string;
}