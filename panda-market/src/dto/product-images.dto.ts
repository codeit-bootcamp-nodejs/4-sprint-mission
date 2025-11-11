import { Transaction } from '@/types/shared.types.js';

export interface CreateProductImages extends Transaction {
  imageData: {
    productId: number;
    url: string;
    publicId: string;
  }[];
}
