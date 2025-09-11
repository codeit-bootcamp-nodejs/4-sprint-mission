import prisma from "../prisma.js";

export async function getProductService(offset, limit, search, user) {
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
