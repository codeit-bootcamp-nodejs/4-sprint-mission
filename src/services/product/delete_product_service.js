import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function deleteProductService(id) {
  await prisma.product.delete({
    where: { id },
  });
}
