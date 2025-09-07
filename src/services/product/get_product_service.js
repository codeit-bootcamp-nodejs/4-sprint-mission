import prisma from "../prisma.js";

export async function getProductService(offset, limit, search) {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: search } },
        { description: { contains: search } },
      ],
    },
    skip: offset,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      price: true,
      createdAt: true,
      comment: true,
      userId: true,
    },
  });
  return products;
}
