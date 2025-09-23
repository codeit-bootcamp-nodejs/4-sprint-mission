import type { GetProductResponseDto } from './get-products-response.dto.js';

export const getProductsSerializer = (product: GetProductResponseDto[]) => {
  return product.map(
    ({
      id,
      name,
      description,
      price,
      tags,
      author,
      isLiked,
    }) => ({
      id,
      name,
      description,
      price,
      tags,
      author,
      isLiked,
    }),
  );
};
