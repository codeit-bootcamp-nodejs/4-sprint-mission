import type { NextFunction, Request, Response } from 'express';
import { toggleProductLike } from './toggle-products-like.service.js';
export const toggleProductLikeController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;
    const isLiked = await toggleProductLike(
      Number(req.user.id),
      Number(productId),
    );
    res.json({ productId: Number(productId), isLiked });
  } catch (err) {
    next(err);
  }
};
