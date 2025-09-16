import prisma from "../prisma.js";

export async function getArticleByIdService(id, user) {
  const article = await prisma.article.findUnique({
    where: { id },
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
  const { _count, like, ...rest } = article;
  return {
    ...rest,
    likeCount: _count.like,
    isLiked: !!user.id && like.some((l) => l.userId === user.id),
  };
}
