import type { Request, Response, NextFunction } from "express";
import { toggleArticleLike } from "../services/articleLikeService";

export const articleLike = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(req.user!.id);

    const articleId = Number(req.params.articleId);

    const result = await toggleArticleLike(userId, articleId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
