import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getArticleService(offset, limit, search) {
  try {
    const article = await prisma.article.findMany({
      where: {
        OR: [
          { title: { contains: search } },
          { content: { contains: search } },
        ],
      },
      skip: offset,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });
    return article;
  } catch (e) {
    console.log(e);
  }
}
