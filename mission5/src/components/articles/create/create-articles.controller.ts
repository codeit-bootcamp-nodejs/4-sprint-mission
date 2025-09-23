import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import type { NextFunction, Request, Response } from 'express';
import { CreateArticleDto } from './create-articles.dto.js';
import { createArticleSerializer } from './create-articles.serializer.js';
import { createArticleService } from './create-articles.service.js';

export const createArticleController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const dto = plainToInstance(CreateArticleDto, {
      ...req.body,
      authorId: req.user.id,
    });
    const errors = await validate(dto);
    if (errors.length > 0) {
      res.status(400).json(errors);
      return;
    }

    const article = await createArticleService(dto);
    res.status(201).json(createArticleSerializer(article));
  } catch (err) {
    next(err);
  }
};
