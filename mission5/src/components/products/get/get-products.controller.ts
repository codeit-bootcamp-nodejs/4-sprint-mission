import { UnauthorizedError } from '@utils/app-error.js';
import type { NextFunction, Request, Response } from 'express';
import { getProductsService } from './get-products.service.js';

export const getProductsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const userId = req.user?.id;
    const products = await getProductsService(userId);
    res.status(200).json({ products: products ?? [] });
  } catch (err) {
    next(err);
  }
};
