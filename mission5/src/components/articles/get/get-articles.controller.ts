import { UnauthorizedError } from '@utils/app-error.js';
import type { NextFunction, Request, Response } from 'express';
import { getArticlesService } from './get-articles.service.js';

export const getArticlesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError();
    }
    const userId = Number(req.user?.id);
    const articles = await getArticlesService(userId);
    res.status(200).json({ articles });
  } catch (err) {
    next(err);
  }
};
