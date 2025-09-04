import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getArticleByIdService(id) {
  const article = await prisma.article.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      comment: true,
    },
  });
  return article;
}
