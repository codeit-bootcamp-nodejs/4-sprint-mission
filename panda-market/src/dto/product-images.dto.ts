import { ProductId } from '../types/product.types.js';
import { Transaction } from '../types/shared.type.js';

export interface CreateProductImages extends Transaction {
  imageData: {
    productId: number;
    url: string;
    publicId: string;
  }[];
}

export interface ProductImageParams extends ProductId, Transaction {}
