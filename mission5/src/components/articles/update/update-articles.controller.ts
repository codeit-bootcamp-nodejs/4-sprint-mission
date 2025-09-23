import { UnauthorizedError } from '@utils/app-error.js';
import type { NextFunction, Request, Response } from 'express';
import {
  UpdateArticleBodyDto,
  UpdateArticleParamsDto,
} from './update-articles.dto.js';
import { updateArticleService } from './update-articles.service.js';

export const updateArticleController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const { params, body } = res.locals['validated'] as {
      params: UpdateArticleParamsDto;
      body: UpdateArticleBodyDto;
    };

    const updated = await updateArticleService({
      articleId: Number(params.articleId),
      userId: Number(req.user.id),
      title: body.title,
      content: body.content,
    });

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};
