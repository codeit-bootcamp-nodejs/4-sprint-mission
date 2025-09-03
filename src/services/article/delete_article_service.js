import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function deleteArticleService(id) {
  await prisma.article.delete({
    where: { id },
  });
}
