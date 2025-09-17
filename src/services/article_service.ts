import prisma from "./prisma";

export async function createArticleService({
  title,
  content,
  user,
}: Article.Create) {
  const article = await prisma.article.create({
    data: { title, content, userId: user.id },
  });
  return article;
}

export async function deleteArticleService({ id, user }: Article.Delete) {
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) throw new Error("NOT_FOUND");
  if (article.userId !== user.id) throw new Error("FORBIDDEN");
  await prisma.article.delete({
    where: { id },
  });
}

export async function getArticleByIdService({ id, user }: Article.Delete) {
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
  if (!article) {
    throw new Error("NOT_FOUND");
  }
  const { _count, like, ...rest } = article;
  return {
    ...rest,
    likeCount: _count.like ?? 0,
    isLiked: !!user.id && like.some((l) => l.userId === user.id),
  };
}

export async function getArticleService({
  offset,
  limit,
  search,
  user,
}: Article.Get) {
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

export async function updateArticleService({
  id,
  updateData,
  user,
}: Article.Update) {
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
