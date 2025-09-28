import type { Request, Response, NextFunction } from "express";
import { toggleProductLike } from "../services/productLikeService.js";

export const productLike = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(req.user!.id);

    const productId = Number(req.params.productId);

    const result = await toggleProductLike(userId, productId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
