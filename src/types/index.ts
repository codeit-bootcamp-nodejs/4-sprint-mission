import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

// 사용자 관련 타입
export interface User {
  id: number;
  email: string;
  nickname: string;
  image?: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse {
  id: number;
  email: string;
  nickname: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 상품 관련 타입
export interface Product {
  id: number;
  title: string;
  content: string;
  image?: string;
  price: number;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  author?: UserResponse;
  likesCount?: number;
  commentsCount?: number;
  isLiked?: boolean;
}

// 게시글 관련 타입
export interface Post {
  id: number;
  title: string;
  content: string;
  image?: string;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  author?: UserResponse;
  likesCount?: number;
  commentsCount?: number;
  isLiked?: boolean;
}

// 댓글 관련 타입
export interface Comment {
  id: number;
  content: string;
  authorId: number;
  productId?: number;
  postId?: number;
  createdAt: Date;
  updatedAt: Date;
  author?: UserResponse;
}

// 좋아요 관련 타입
export interface ProductLike {
  id: number;
  userId: number;
  productId: number;
  createdAt: Date;
  user?: UserResponse;
}

export interface PostLike {
  id: number;
  userId: number;
  postId: number;
  createdAt: Date;
  user?: UserResponse;
}

// Refresh Token 타입
export interface RefreshToken {
  id: number;
  token: string;
  userId: number;
  expiresAt: Date;
  createdAt: Date;
}

// JWT 페이로드 타입
export interface JwtTokenPayload extends JwtPayload {
  userId: number;
  type: 'access' | 'refresh';
}

// API 요청/응답 타입
export interface AuthenticatedRequest extends Request {
  user: UserResponse;
}

export interface OptionalAuthRequest extends Request {
  user?: UserResponse | null;
}

// 회원가입 요청 타입
export interface SignupRequest {
  email: string;
  nickname: string;
  password: string;
}

// 로그인 요청 타입
export interface LoginRequest {
  email: string;
  password: string;
}

// 토큰 응답 타입
export interface TokenResponse {
  message: string;
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
}

// 토큰 갱신 요청 타입
export interface RefreshTokenRequest {
  refreshToken: string;
}

// 프로필 업데이트 요청 타입
export interface UpdateProfileRequest {
  nickname?: string;
  image?: string;
}

// 비밀번호 변경 요청 타입
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// 상품 생성/수정 요청 타입
export interface ProductRequest {
  title: string;
  content: string;
  price: number;
  image?: string;
}

// 게시글 생성/수정 요청 타입
export interface PostRequest {
  title: string;
  content: string;
  image?: string;
}

// 댓글 생성/수정 요청 타입
export interface CommentRequest {
  content: string;
}

// 페이지네이션 타입
export interface PaginationQuery {
  page?: string;
  limit?: string;
  search?: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
}

// API 응답 타입
export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  error?: string;
  details?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

// 에러 타입
export interface ApiError {
  status: number;
  message: string;
  details?: any;
}

// 환경변수 타입
export interface Environment {
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_EXPIRES_IN: string;
  PORT: string;
  NODE_ENV?: string;
}