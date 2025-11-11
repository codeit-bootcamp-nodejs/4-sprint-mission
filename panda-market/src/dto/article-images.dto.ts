import { Transaction } from '@/types/shared.types.js';

export interface CreateArticleImages extends Transaction {
  imageData: {
    articleId: number;
    url: string;
    publicId: string;
  }[];
}
