import prisma from "../prisma.js";

export async function deleteProductService(id) {
  await prisma.product.delete({
    where: { id },
  });
}
