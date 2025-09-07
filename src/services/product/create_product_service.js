import prisma from "../prisma.js";

export async function createProductService({ data, user }) {
  const product = await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      tags: data.tags,
      userId: user.id,
    },
  });
  return product;
}
