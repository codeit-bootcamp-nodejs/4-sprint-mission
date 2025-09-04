import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createProductService(data) {
  const product = await prisma.product.create({ data });
  return product;
}
