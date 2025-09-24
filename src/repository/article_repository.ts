import prisma from "./prisma";

export async function findUniqueRepo(id: number) {
  return await prisma.article.findUnique({ where: { id } });
}

export async function createArticleRepo({
  title,
  content,
  user,
}: Article.Create) {
  return await prisma.article.create({
    data: { title, content, userId: user.id },
  });
}

export async function deleteArticleRepo(id: number) {
  await prisma.article.delete({
    where: { id },
  });
}

export async function getArticleByIdRepo(id: number) {
  return await prisma.article.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
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

export async function getArticleRepo(
  offset: number,
  limit: number,
  search: string
) {
  return await prisma.article.findMany({
    where: {
      OR: [{ title: { contains: search } }, { content: { contains: search } }],
    },
    skip: offset,
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      content: true,
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

export async function updateArticleRepo({
  id,
  updateData,
  user,
}: Article.Update) {
  return await prisma.article.update({
    where: { id },
    data: { ...updateData, userId: user.id },
  });
}
