import prisma from "../prisma.js";

export async function getProductByIdService(id) {
  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      tags: true,
      createdAt: true,
      comment: true,
      userId: true,
    },
  });
  return product;
}
