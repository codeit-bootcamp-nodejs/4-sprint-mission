import prisma from '@config/prisma.js';
import type { CreateProductDto } from './create-products.dto.js';

export const createProductService = async (input: CreateProductDto) => {
  return prisma.product.create({
    data: {
      name: input.name,
      description: input.description ?? null,
      price: input.price,
      tags: input.tags || [],
      author: { connect: { id: input.authorId } },
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      tags: true,
      authorId: true,
    },
  });
};
