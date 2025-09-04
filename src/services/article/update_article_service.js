import prisma from "../prisma.js";

export async function updateArticleService({ id, updateData }) {
  const article = await prisma.article.update({
    where: { id },
    data: updateData,
  });
  return article;
}
