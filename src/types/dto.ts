// src/types/dto.ts

// User DTOs
export interface SignUpDto {
  email?: string;
  nickname?: string;
  password?: string;
}

export interface SignInDto {
  email?: string;
  password?: string;
}

export interface UpdateUserInfoDto {
  nickname?: string;
  image?: string;
}

export interface ChangePasswordDto {
  currentPassword?: string;
  newPassword?: string;
}

// Product DTOs
export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  tags: string[];
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  tags?: string[];
}

// Article DTOs
export interface CreateArticleDto {
  title: string;
  content: string;
}

export interface UpdateArticleDto {
  title?: string;
  content?: string;
}

// Comment DTOs
export interface CreateCommentDto {
  content: string;
}

export interface UpdateCommentDto {
  content: string;
}

export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

// User 응답 DTO
export interface UserResponseDto {
  id: number;
  email: string;
  nickname: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Product 응답 DTO
export interface ProductSummaryResponseDto {
  id: number;
  name: string;
  price: number;
  createdAt: Date;
  isLiked: boolean;
  _count: {
    likes: number;
  };
}

export interface ProductListResponseDto {
  data: ProductSummaryResponseDto[];
  pagination: Pagination;
}

export interface ProductDetailResponseDto {
  id: number;
  userId: number;
  name: string;
  description: string;
  price: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isLiked: boolean;
  _count: {
    likes: number;
  };
}

// Article 응답 DTO
export interface ArticleSummaryResponseDto {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  isLiked: boolean;
  _count: {
    likes: number;
  };
}

export interface ArticleListResponseDto {
  data: ArticleSummaryResponseDto[];
  pagination: Pagination;
}

export interface ArticleDetailResponseDto {
  id: number;
  userId: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isLiked: boolean;
  _count: {
    likes: number;
  };
}

// Comment 응답 DTO
export interface CommentResponseDto {
  id: number;
  content: string;
  createdAt: Date;
}

export interface CommentListResponseDto {
  data: CommentResponseDto[];
  nextCursor: number | null;
}

// Like 응답 DTO
export interface LikeResponseDto {
  message: string;
}

// Auth 응답 DTO
export interface TokensResponseDto {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponseDto {
  accessToken: string;
}

// Notification 응답 DTO
export interface NotificationResponseDto {
  id: number;
  message: string;
  link: string;
  isRead: boolean;
  createdAt: Date;
}
