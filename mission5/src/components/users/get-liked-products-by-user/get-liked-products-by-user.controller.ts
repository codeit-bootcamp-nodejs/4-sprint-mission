import type { NextFunction, Request, Response } from 'express';
import { getLikedProductsByUserService } from './get-liked-products-by-user.service.js';
export const getLikedProductsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const products = await getLikedProductsByUserService(req.user.id);
    res.json({ products });
  } catch (err) {
    next(err);
  }
};
