import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getArticleCommentService({ id, take, cursor }) {
  const comment = await prisma.comment.findMany({
    where: { articleId: id },
    take,
    skip: cursor ? 1 : 0,
    ...(cursor && { cursor: { id: cursor } }),
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
  });
  return comment;
}

export async function getProductCommentService({ id, take, cursor }) {
  const comment = await prisma.comment.findMany({
    where: { productId: id },
    take,
    skip: cursor ? 1 : 0,
    ...(cursor && { cursor: { id: cursor } }),
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
  });
  return comment;
}
