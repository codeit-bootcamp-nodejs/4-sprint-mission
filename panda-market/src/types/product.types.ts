import type { UserId } from './shared.type.js';

export interface ProductId {
  productId: number;
}

export interface ProductParams extends UserId, ProductId {}

export interface PostProduct extends UserId {
  name: string;
  description: string;
  price: number;
  tags: string[];
}

export interface PatchProduct extends ProductParams {
  data: {
    name?: string;
    description?: string;
    price?: number;
    tags?: string[];
  };
}
