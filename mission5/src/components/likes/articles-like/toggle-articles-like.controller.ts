import type { NextFunction, Request, Response } from 'express';
import { toggleArticleLike } from './toggle-articles-like.service.js';
export const toggleArticleLikeController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { articleId } = req.params;
    const isLiked = await toggleArticleLike(
      Number(req.user.id),
      Number(articleId),
    );
    res.json({ articleId: Number(articleId), isLiked });
  } catch (err) {
    next(err);
  }
};
