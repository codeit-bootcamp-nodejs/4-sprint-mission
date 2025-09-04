import prisma from "../prisma.js";

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
