import type { Request } from 'express';

// 기본 API 응답 타입
export interface ApiResponse<T = unknown> {
    message: string;
    data?: T;
}

// 인증된 사용자 정보
export interface AuthenticatedUser {
    id: number;
    email: string;
    nickname: string;
}

// 인증된 요청 타입
export interface AuthenticatedRequest extends Request {
    user: AuthenticatedUser;
}

// 리소스 타입 요청
export interface ResourceRequest extends Request {
    resourceType: string;
    resourceId: string | null;
}

// 파일 업로드 요청
export interface UploadRequest extends Request {
    file: Express.Multer.File;
}

// 페이지네이션
export interface PaginationQuery {
    page?: number;
    limit?: number;
}

// 정렬 옵션
export interface SortOptions {
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

// 검색 옵션
export interface SearchOptions {
    search?: string;
    category?: string;
}

// 에러 타입
export interface ErrorWithStatus extends Error {
    status?: number;
}

