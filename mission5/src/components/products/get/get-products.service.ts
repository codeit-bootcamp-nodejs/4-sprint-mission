import prisma from '@config/prisma.js';

export const getProductsService = async (userId: number) => {
  const products = await prisma.product.findMany({
    include: {
      likes: {
        where: { authorId: userId },
      },
      author: true,
    },
  });

  return products.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    tags: product.tags,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    authorId: product.authorId,
    author: product.author,
    isLiked: product.likes.length > 0,
  }));
};
