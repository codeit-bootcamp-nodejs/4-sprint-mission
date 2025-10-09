import { JwtPayload } from "jsonwebtoken";

// Refresh Token 타입
export interface RefreshToken {
  id: number;
  token: string;
  userId: number;
  expiresAt: Date;
  createdAt: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
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

// JWT 페이로드 타입
export interface JwtTokenPayload extends JwtPayload {
  userId: number;
  type: "access" | "refresh";
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

export interface UserResponse {
  id: number;
  email: string;
  nickname: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// API 응답 타입
export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  error?: string;
  details?: any;
}

// IDE -> typescript language server 타입검사를 자동으로 해줌 -> 가끔씩 프로젝트가 커지거나 하면 잘 못잡고...
// typecheck전용ㅇ 스크립트를 하나 만들어두면 좋다.

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

// 사용자 엔티티 타입
export interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// 포스트 엔티티 타입
export interface Post {
  id: number;
  title: string;
  content: string;
  userId: number;
}

// API 응답 타입
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// 페이지네이션 타입
export interface PaginationQuery {
  page?: number;
  limit?: number;
}

// 정렬 타입
export interface SortQuery {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// 공통 쿼리 파라미터 타입
export interface CommonQuery extends PaginationQuery, SortQuery {
  search?: string;
}
