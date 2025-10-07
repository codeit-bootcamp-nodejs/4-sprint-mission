import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const findUniqueArticle = async (id) => {
  return prisma.article.findUnique({
    where: { id },
  });
};
