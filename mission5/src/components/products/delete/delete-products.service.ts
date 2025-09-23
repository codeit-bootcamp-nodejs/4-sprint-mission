import prisma from '@config/prisma.js';
import { AppError } from '@utils/app-error.js';

// 게시글 삭제
export const deleteProductService = async ({
  productId,
  userId,
}: {
  productId: number;
  userId: number;
}) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });

  if (!product) {
    throw new AppError('Product not found', 404);
  }
  if (product.authorId !== userId) {
    throw new AppError('Forbidden', 403);
  }

  await prisma.product.delete({
    where: { id: productId },
  });
};
