import prisma from "../prisma.js";

export async function createProductService(data) {
  const product = await prisma.product.create({ data });
  return product;
}
