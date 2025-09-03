import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function updateArticleService({ id, updateData }) {
  const article = await prisma.article.update({
    where: { id },
    data: updateData,
  });
  return article;
}
