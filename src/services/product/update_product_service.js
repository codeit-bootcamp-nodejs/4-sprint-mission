import prisma from "../prisma.js";

export async function updateProductService({ id, updateData }) {
  const product = await prisma.product.update({
    where: { id },
    data: updateData,
  });
  return product;
}
