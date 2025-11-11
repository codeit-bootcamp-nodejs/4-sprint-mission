import { ArticleIdWithTx } from '@/dto/articles.dto.js';

export interface ArticleId {
  articleId: number;
}

export interface BaseArticleInput {
  title: string;
  content: string;
  imageUrls: string[];
}

export interface ImageUpdateInput extends ArticleIdWithTx {
  newImages: string[];
}
