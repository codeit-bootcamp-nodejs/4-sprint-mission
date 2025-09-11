// product-type.ts
import type { Prisma } from '@prisma/client';
import { prisma } from '../lib/prismaClient.js';

// DB에서 실제로 나오는 타입
export type RawProduct = NonNullable<
  Awaited<ReturnType<typeof prisma.product.findUnique>>
>;

// 응답용 DTO
export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
  userId: number;
  likeCount: number;
  isLiked: boolean;
  comments: CommentResponse[];
}

// 댓글 응답 DTO
export interface CommentResponse {
  id: number;
  content: string;
  likeCount: number;
  isLiked: boolean;
  user: { username: string };
}

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    likedBy: { select: { id: true } };
    comments: {
      select: {
        id: true;
        content: true;
        likeCount: true;
        likedBy: { select: { id: true } };
      };
    };
    user: { select: { username: true } };
  };
}>;

export type ProductQuery = {
  page?: number;
  limit?: number;
  sort?: 'recent' | 'old';
  keyword?: string;
};

export type ProductById = {
  id: true;
  name: true;
  description: true;
  price: true;
  tags: true;
  images: true;
  userId: true;
  likeCount: true;
  likedBy: { select: { id: true; username: true } };
  comments: {
    select: {
      id: true;
      content: true;
      likeCount: true;
      createdAt: true;
      updatedAt: true;
      user: { select: { username: true } };
      likedBy: {
        where: { id: number };
        select: { id: true };
      };
    };
  };
};
