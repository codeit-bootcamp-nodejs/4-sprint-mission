import type { AuthenticatedUser } from './common.js';

// 댓글 생성 서비스 데이터
export interface CreateCommentServiceData {
    content: string;
    userId: number;
    resourceType: string;
    resourceId: number;
}

// 댓글 생성 리포지토리 데이터
export interface CreateCommentData {
    content: string;
    userId: number;
    postId?: number;
    productId?: number;
}

// 댓글 업데이트 데이터
export interface UpdateCommentData {
    content: string;
}

// 댓글 응답 타입
export interface CommentWithUser {
    id: number;
    content: string;
    userId: number;
    resourceType: string;
    resourceId: number;
    createdAt: Date;
    updatedAt: Date;
    user: AuthenticatedUser;
}

// 댓글 요청 타입들
export interface CreateCommentRequest {
    body: {
        content: string;
    };
    user: AuthenticatedUser;
    resourceType: string;
    resourceId: string;
}

export interface UpdateCommentRequest {
    body: {
        content: string;
    };
    user: AuthenticatedUser;
    resourceType: string;
    resourceId: string;
    params: {
        id: string;
    };
}

export interface DeleteCommentRequest {
    user: AuthenticatedUser;
    resourceType: string;
    resourceId: string;
    params: {
        id: string;
    };
}

export interface GetCommentRequest {
    user: AuthenticatedUser;
    params: {
        id: string;
    };
}

export interface GetCommentsByResourceRequest {
    resourceType: string;
    resourceId: string;
}

