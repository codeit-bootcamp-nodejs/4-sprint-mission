import { AuthProductParams, ProductIdWithTx } from '@/dto/products.dto.js';

export interface ProductId {
  productId: number;
}

export interface BaseProductInput {
  name: string;
  description: string;
  price: number;
  tags: string[];
  imageUrls: string[];
}

export interface TagUpdateInput extends ProductIdWithTx {
  newTags: string[];
}

export interface ImageUpdateInput extends ProductIdWithTx {
  newImages: string[];
}

export interface PriceUpdateInput extends AuthProductParams {
  newPrice: number;
}
