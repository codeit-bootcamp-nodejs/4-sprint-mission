import { Transaction } from '@/types/shared.type.js';

export interface CreateArticleImages extends Transaction {
  imageData: {
    articleId: number;
    url: string;
    publicId: string;
  }[];
}
