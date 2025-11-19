import { Product, Article, Comment, User, Like } from '@prisma/client';

// Re-export Prisma types as single source of truth
export type { Product, Article, Comment, User, Like };

// Extended types with relations
export type ProductWithUser = Product & {
  user: User;
  comments: Comment[];
  likes: Like[];
  likeCount: number;
  commentCount: number;
};

export type ArticleWithUser = Article & {
  user: User;
  comments: Comment[];
  likes: Like[];
  likeCount: number;
  commentCount: number;
};

export type CommentWithUser = Comment & {
  user: User;
};

export type UserPublic = Omit<User, 'password' | 'refreshToken'>;

// Pagination types
export type PaginationParams = {
  page?: number;
  limit?: number;
  orderBy?: string;
  sortOrder?: 'asc' | 'desc';
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

// Query filter types
export type ProductFilter = {
  userId?: number;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  search?: string;
};

export type ArticleFilter = {
  userId?: number;
  search?: string;
};
