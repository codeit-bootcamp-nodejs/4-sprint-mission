import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function updateProductService({ id, updateData }) {
  const product = await prisma.product.update({
    where: { id },
    data: updateData,
  });
  return product;
}
