import prisma from "../prisma.js";

export async function deleteProductService({ id, user }) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new Error("NOT_FOUND");
  if (product.userId !== user.id) throw new Error("FORBIDDEN");
  await prisma.product.delete({
    where: { id },
  });
}
