import { aritcleLikeReposioty } from "../repositories/articleLikeRepository";
import { articleRepository } from "../repositories/articleRepository";
import type { Like } from "../types/dto";

export const toggleArticleLike = async (
  userId: number,
  articleId: number
): Promise<{ liked: boolean; like: Like | null }> => {
  try {
    const article = await articleRepository.getArticleById(articleId);

    if (!article) {
      const error: HttpError = new Error("존재하지 않는 게시글입니다.");
      error.status = 404;
      throw error;
    }

    const existingLike = await aritcleLikeReposioty.findLike(userId, articleId);

    if (existingLike) {
      await aritcleLikeReposioty.deleteLike(userId, articleId);

      return { liked: false, like: null };
    } else {
      const like = await aritcleLikeReposioty.createLike(userId, articleId);

      return { liked: true, like };
    }
  } catch (err) {
    throw err;
  }
};
