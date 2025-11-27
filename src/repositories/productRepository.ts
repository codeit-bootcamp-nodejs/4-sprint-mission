import { prisma } from '../utils/prisma';

export async function createProduct(data: {
  name: string;
  description: string;
  price: number;
  tags: string[];
  userId: number;
}) {
  return prisma.product.create({
    data,
  });
}

export async function getProducts(params: {
  page?: number;
  pageSize?: number;
  keyword?: string;
  sortBy?: string;
}) {
  const { page = 1, pageSize = 10, keyword, sortBy = 'recent' } = params;
  const skip = (page - 1) * pageSize;

  const where = keyword
    ? {
        name: {
          contains: keyword,
        },
      }
    : {};

  const orderBy = sortBy === 'recent' ? { createdAt: 'desc' as const } : { createdAt: 'asc' as const };

  const [list, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: pageSize,
      orderBy,
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return { list, totalCount };
}

export async function getProductById(id: number) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          nickname: true,
        },
      },
    },
  });
}

export async function updateProduct(id: number, data: {
  name?: string;
  description?: string;
  price?: number;
  tags?: string[];
}) {
  return prisma.product.update({
    where: { id },
    data,
  });
}

export async function deleteProduct(id: number) {
  return prisma.product.delete({
    where: { id },
  });
}
