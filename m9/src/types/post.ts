import type { AuthenticatedUser } from './common.js';

// 게시글 생성 데이터
export interface CreatePostData {
    title: string;
    content: string;
    userId: number;
}

// 게시글 업데이트 데이터
export interface UpdatePostData {
    title: string;
    content: string;
}

// 게시글 응답 타입 (좋아요 포함)
export interface PostWithLike {
    id: number;
    title: string;
    content: string | null;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
    user: AuthenticatedUser;
    isLiked: boolean;
}

// 게시글 요청 타입들
export interface CreatePostRequest {
    body: {
        title: string;
        content: string;
    };
    user: AuthenticatedUser;
}

export interface UpdatePostRequest {
    body: {
        title: string;
        content: string;
    };
    user: AuthenticatedUser;
    params: {
        id: string;
    };
}

export interface GetPostRequest {
    user?: AuthenticatedUser;
    params: {
        id: string;
    };
}

export interface DeletePostRequest {
    user: AuthenticatedUser;
    params: {
        id: string;
    };
}

