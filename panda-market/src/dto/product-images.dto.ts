import { Transaction } from '../types/shared.type.js';

export interface CreateProductImages extends Transaction {
  imageData: {
    productId: number;
    url: string;
    publicId: string;
  }[];
}
