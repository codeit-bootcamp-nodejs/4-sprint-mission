import prisma from "../prisma.js";

export async function updateArticleService({ id, updateData, user }) {
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) {
    throw new Error("NOT_FOUND");
  }
  if (article.userId !== user.id) {
    throw new Error("FORBIDDEN");
  }
  const updatedArticle = await prisma.article.update({
    where: { id },
    data: { ...updateData, userId: user.id },
  });

  return updatedArticle;
}
