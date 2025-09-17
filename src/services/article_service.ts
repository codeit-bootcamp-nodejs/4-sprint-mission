import * as articleRepo from "../repository/article_repository";

export async function createArticleService({
  title,
  content,
  user,
}: Article.Create) {
  const article = await articleRepo.createArticleRepo({
    title,
    content,
    user,
  });
  return article;
}

export async function deleteArticleService({ id, user }: Article.Delete) {
  const article = await articleRepo.findUniqueRepo(id);
  if (!article) throw new Error("NOT_FOUND");
  if (article.userId !== user.id) throw new Error("FORBIDDEN");
  await articleRepo.deleteArticleRepo(id);
}

export async function getArticleByIdService({ id, user }: Article.Delete) {
  const article = await articleRepo.getArticleByIdRepo(id);
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
    const article = await articleRepo.getArticleRepo(offset, limit, search);
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
  const article = await articleRepo.findUniqueRepo(id);
  if (!article) {
    throw new Error("NOT_FOUND");
  }
  if (article.userId !== user.id) {
    throw new Error("FORBIDDEN");
  }
  const updatedArticle = articleRepo.updateArticleRepo({
    id,
    updateData,
    user,
  });
  return updatedArticle;
}
