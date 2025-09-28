import type { GetListParams, UserId } from '@/types/shared.type.js';
import type { ProductId } from '../types/product.types.js';

export interface CreateDTO extends UserId {
  name: string;
  description: string;
  price: number;
  tags: string[];
}

export interface UpdateDTO extends ProductId {
  data: {
    name?: string;
    description?: string;
    price?: number;
    tags?: string[];
  };
}

export interface FindByIdDTO extends UserId, ProductId {}

export type FindManyDTO = GetListParams;

export type DeleteDTO = ProductId; // eslint 오류 방지

export interface Like extends ProductId, UserId {}

export type LikeDTO = Like;
export type UnlikeDTO = Like;
