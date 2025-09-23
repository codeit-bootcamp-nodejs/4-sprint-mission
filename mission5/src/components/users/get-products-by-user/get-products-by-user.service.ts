import prisma from '@config/prisma.js';

export const getProductsByUserService = async (userId: number) => {
  const products = await prisma.product.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      tags: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return products;
};
