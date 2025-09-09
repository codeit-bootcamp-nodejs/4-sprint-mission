import { toggleArticleLike } from "../services/articleLikeService.js";

export const articleLike = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const articleId = Number(req.params.articleId);

    const result = await toggleArticleLike(userId, articleId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
