// src/types/index.ts
import { Request } from 'express';

// Express의 Request 타입에 userId 속성을 추가하기 위한 전역 네임스페이스 확장
declare global {
    namespace Express {
        interface Request {
            userId?: number; // authMiddleware를 통과한 요청에 존재
        }
    }
}

// Request 확장 타입
export interface AuthRequest extends Request {
  userId?: number;
}

// 사용자 관련 타입
export interface User {
  id: number;
  email: string;
  nickname: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister {
  email: string;
  nickname: string;
  password: string;
}

export interface UserUpdate {
  nickname?: string;
  image?: string;
}

export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
}

// 상품 관련 타입
export interface Product {
  id: number;
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProduct {
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
}

// 게시글 및 댓글 관련 타입
export interface Post {
  id: number;
  title: string;
  content: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: number;
  content: string;
  userId: number;
  postId?: number;
  productId?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateComment {
  content: string;
  postId?: number;
  productId?: number;
}