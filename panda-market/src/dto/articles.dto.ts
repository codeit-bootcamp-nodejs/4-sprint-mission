import type { ArticleId } from '@/types/article.types.js';
import type { GetListParams, UserId } from '@/types/shared.type.js';

export interface CreateDTO extends UserId {
  title: string;
  content: string;
}

export interface UpdateDTO extends ArticleId {
  data: {
    title?: string;
    content: string;
  };
}

export interface FindByIdDTO extends UserId, ArticleId {}

export type FindManyDTO = GetListParams;

export type DeleteDTO = ArticleId; // eslint 오류 방지

export interface Like extends ArticleId, UserId {}

export type LikeDTO = Like;
export type UnlikeDTO = Like;
