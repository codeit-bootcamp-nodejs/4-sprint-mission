import prisma from "../prisma.js";

export async function updateProductService({ id, updateData, user }) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new Error("NOT_FOUND");
  if (product.userId !== user.id) throw new Error("FORBIDDEN");
  const updatedProduct = await prisma.product.update({
    where: { id },
    data: { updateData, userId: user.id },
  });
  return updatedProduct;
}
