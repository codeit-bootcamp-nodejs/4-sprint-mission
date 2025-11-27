import { prisma } from '../utils/prisma';

export async function createArticle(data: {
  title: string;
  content: string;
  userId: number;
}) {
  return prisma.article.create({
    data,
  });
}

export async function getArticles(params: {
  page?: number;
  pageSize?: number;
  keyword?: string;
}) {
  const { page = 1, pageSize = 10, keyword } = params;
  const skip = (page - 1) * pageSize;

  const where = keyword
    ? {
        OR: [
          { title: { contains: keyword } },
          { content: { contains: keyword } },
        ],
      }
    : {};

  const [list, totalCount] = await Promise.all([
    prisma.article.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    }),
    prisma.article.count({ where }),
  ]);

  return { list, totalCount };
}

export async function getArticleById(id: number) {
  return prisma.article.findUnique({
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

export async function updateArticle(id: number, data: {
  title?: string;
  content?: string;
}) {
  return prisma.article.update({
    where: { id },
    data,
  });
}

export async function deleteArticle(id: number) {
  return prisma.article.delete({
    where: { id },
  });
}
