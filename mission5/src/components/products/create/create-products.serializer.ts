import type { CreateProductResponseDto } from './create-products-response.dto.js';

export const createProductSerializer = (data: {
  id: number;
  authorId: number;
  name: string;
  description: string | null;
  price: number;
  tags: string[];
}): CreateProductResponseDto => {
  const { id, authorId, name, description, price, tags } = data;
  return {
    id,
    authorId,
    name,
    description: description ?? null,
    price,
    tags,
  };
};
