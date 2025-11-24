import * as articleRepo from "../repository/article_repository";
import { AppError } from "../utils/error";

type LikeType = {
  userId: number | null;
};

type CountType = {
  like: number | null;
};

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
  if (!article) throw new AppError("존재하지 않는 게시글입니다.", 404);
  if (article.userId !== user.id) throw new AppError("권한이 없습니다.", 403);
  await articleRepo.deleteArticleRepo(id);
}

export async function getArticleByIdService({ id, user }: Article.Delete) {
  const article = await articleRepo.getArticleByIdRepo(id);
  if (!article) {
    throw new AppError("존재하지 않는 게시글입니다.", 404);
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
    return article.map(
      ({ _count, like, ...rest }: { _count: CountType; like: LikeType[] }) => ({
        ...rest,
        likeCount: _count.like,
        isLiked: !!user.id && like.some((l: LikeType) => l.userId === user.id),
      })
    );
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
    throw new AppError("존재하지 않는 게시글입니다.", 404);
  }
  if (article.userId !== user.id) {
    throw new AppError("권한이 없습니다.", 403);
  }
  const updatedArticle = articleRepo.updateArticleRepo({
    id,
    updateData,
    user,
  });
  return updatedArticle;
}
