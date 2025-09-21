import { aritcleLikeReposioty } from "../repositories/articleLikeRepository.js";
import { articleRepository } from "../repositories/articleRepository.js";

interface Like {
  userId: number;
  articleId: number | null;
}

export const toggleArticleLike = async (
  userId: number,
  articleId: number
): Promise<{ liked: boolean; like: Like | null }> => {
  try {
    const article = await articleRepository.getArticleById(articleId);

    if (!article) {
      const error: HttpError = new Error("존재하지 않는 게시글입니다.");
      error.status = 400;
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
