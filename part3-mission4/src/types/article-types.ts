import type { Prisma } from '@prisma/client';
import { prisma } from '../lib/prismaClient.js';

// DB에서 실제 Article 타입
export type RawArticle = NonNullable<
  Awaited<ReturnType<typeof prisma.article.findUnique>>
>;

// 응답용 DTO
export interface ArticleResponse {
  id: number;
  title: string;
  content: string;
  tags: string[];
  images: string[];
  likeCount: number;
  isLiked: boolean;
  user: { username: string };
  comments: CommentResponse[];
}

export interface CommentResponse {
  id: number;
  content: string;
  likeCount: number;
  isLiked: boolean;
  user: { username: string };
}

export type ArticleWithRelations = Prisma.ArticleGetPayload<{
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

export type ArticleQuery = {
  page?: number;
  limit?: number;
  sort?: 'recent' | 'old';
  keyword?: string;
};

export interface UpdateArticleDto {
  title?: string;
  content?: string;
  price?: number;
  tags?: string[];
  images?: string[];
}
