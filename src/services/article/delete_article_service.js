import prisma from "../prisma.js";

export async function deleteArticleService({ id, user }) {
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) throw new Error("NOT_FOUND");
  if (article.userId !== user.id) throw new Error("FORBIDDEN");
  await prisma.article.delete({
    where: { id },
  });
}
