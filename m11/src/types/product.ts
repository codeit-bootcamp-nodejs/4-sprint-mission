import type { AuthenticatedUser } from './common.js';

// 태그 타입
export interface Tag {
    id: number;
    name: string;
    createdAt: Date;
}

// 상품 생성 데이터
export interface CreateProductData {
    name: string;
    description: string;
    price: number;
    tags: string[];
    userId: number;
}

// 상품 업데이트 데이터
export interface UpdateProductData {
    name: string;
    description: string;
    price: number;
    tags: string[];
}

// 상품 응답 타입 (좋아요 및 태그 포함)
export interface ProductWithLike {
    id: number;
    name: string;
    description: string | null;
    price: number;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
    user: AuthenticatedUser;
    tags: Tag[];
    isLiked: boolean;
}

// 상품 요청 타입들
export interface CreateProductRequest {
    body: {
        name: string;
        description: string;
        price: number;
        tags: string[];
    };
    user: AuthenticatedUser;
}

export interface UpdateProductRequest {
    body: {
        name: string;
        description: string;
        price: number;
        tags: string[];
    };
    user: AuthenticatedUser;
    params: {
        id: string;
    };
}

export interface GetProductRequest {
    user?: AuthenticatedUser;
    params: {
        id: string;
    };
}

export interface DeleteProductRequest {
    user: AuthenticatedUser;
    params: {
        id: string;
    };
}

