import type { UserId } from './shared.type.js';

export interface ArticleId {
  articleId: number;
}

export interface ArticleParams extends UserId, ArticleId {}

export interface PostArticle extends UserId {
  title: string;
  content: string;
}

export interface PatchArticle extends ArticleId, UserId {
  data: {
    title?: string;
    content: string;
  };
}
