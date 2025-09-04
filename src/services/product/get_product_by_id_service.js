import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
    },
  });
  return product;
}
