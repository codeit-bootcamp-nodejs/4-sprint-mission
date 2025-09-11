import prisma from "../prisma.js";

export async function getArticleService(offset, limit, search, user) {
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
        comment: true,
        userId: true,
        _count: {
          select: { like: true },
        },
        like: {
          select: { userId: true },
        },
      },
    });
    return article.map(({ _count, like, ...rest }) => ({
      ...rest,
      likeCount: _count.like,
      isLiked: !!user.id && like.some((l) => l.userId === user.id),
    }));
  } catch (e) {
    console.log(e);
  }
}
