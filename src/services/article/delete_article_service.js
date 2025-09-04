import prisma from "../prisma.js";

export async function deleteArticleService(id) {
  await prisma.article.delete({
    where: { id },
  });
}
