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