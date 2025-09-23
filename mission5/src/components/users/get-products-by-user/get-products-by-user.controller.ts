import { getProductsByUserService } from './get-products-by-user.service.js';
import type { Request, Response, NextFunction } from 'express';

export const getProductsByUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await getProductsByUserService(req.user.id);

    res.status(200).json({ products });
  } catch (err) {
    next(err);
  }
};
