import prisma from "./prisma";

export async function createProductService({ data, user }: Product.Create) {
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

export async function deleteProductService({ id, user }: Product.Delete) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new Error("NOT_FOUND");
  if (product.userId !== user.id) throw new Error("FORBIDDEN");
  await prisma.product.delete({
    where: { id },
  });
}

export async function getProductByIdService({ id, user }: Product.Delete) {
  const product = await prisma.product.findUnique({
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
  if (!product) {
    throw new Error("NOT_FOUND");
  }
  const { _count, like, ...rest } = product;
  return {
    ...rest,
    likeCount: _count.like,
    isLiked: !!user.id && like.some((l) => l.userId === user.id),
  };
}

export async function getProductService({
  offset,
  limit,
  search,
  user,
}: Article.Get) {
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
      _count: {
        select: { like: true },
      },
      like: {
        select: { userId: true },
      },
    },
  });
  return products.map(({ _count, like, ...rest }) => ({
    ...rest,
    likeCount: _count.like,
    isLiked: !!user.id && like.some((l) => l.userId === user.id),
  }));
}

export async function updateProductService({
  id,
  updateData,
  user,
}: Product.Update) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new Error("NOT_FOUND");
  if (product.userId !== user.id) throw new Error("FORBIDDEN");
  const updatedProduct = await prisma.product.update({
    where: { id },
    data: { ...updateData, userId: user.id },
  });
  return updatedProduct;
}
