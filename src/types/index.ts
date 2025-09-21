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
  sortOrder?: 'asc' | 'desc';
}

// 공통 쿼리 파라미터 타입
export interface CommonQuery extends PaginationQuery, SortQuery {
  search?: string;
}