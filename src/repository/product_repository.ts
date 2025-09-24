import prisma from "./prisma";

export async function findUniqueProduct(id: number) {
  return await prisma.product.findUnique({ where: { id } });
}

export async function createProductRepo({ data, user }: Product.Create) {
  return await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      tags: data.tags,
      userId: user.id,
    },
  });
}

export async function deleteProduct(id: number) {
  await prisma.product.delete({
    where: { id },
  });
}

export async function getProductByIdRepo(id: number) {
  return await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      tags: true,
      createdAt: true,
      comment: true,
      userId: true,
      _count: {
        select: { like: true },
      },
      like: {
        select: { userId: true },
      },
    },
  });
}

export async function getProductRepo(
  offset: number,
  limit: number,
  search: string
) {
  return await prisma.product.findMany({
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
      _count: {
        select: { like: true },
      },
      like: {
        select: { userId: true },
      },
    },
  });
}

export async function updateProduct({ id, updateData, user }: Product.Update) {
  return await prisma.product.update({
    where: { id },
    data: { ...updateData, userId: user.id },
  });
}
