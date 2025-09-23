import prisma from '@config/prisma.js';
import type { UpdateProductDto } from './update-products.dto.js';
import { AppError } from '@utils/app-error.js';

export const updateProductService = async (input: UpdateProductDto) => {
  const { productId, userId, name, description, price, tags } = input;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new AppError('Product not found', 404);
  if (product.authorId !== userId) throw new AppError('Forbidden', 403);

  const data: Partial<Omit<UpdateProductDto, 'productId' | 'userId'>> = {};
  if (name !== undefined) data.name = name;
  if (description !== undefined) data.description = description;
  if (price !== undefined) data.price = price;
  if (tags !== undefined) data.tags = tags;

  return prisma.product.update({
    where: { id: productId },
    data,
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      tags: true,
      updatedAt: true,
    },
  });
};
