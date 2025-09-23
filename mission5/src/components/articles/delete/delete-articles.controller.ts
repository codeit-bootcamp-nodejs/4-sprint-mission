import { UnauthorizedError } from '@utils/app-error.js';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import type { NextFunction, Request, Response } from 'express';
import { DeleteArticleDto } from './delete-articles.dto.js';
import { deleteArticleService } from './delete-articles.service.js';

// 게시글 삭제 컨트롤러
export const deleteArticleController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    // DTO 변환 + 검증
    const dto = plainToInstance(DeleteArticleDto, req.params);
    const errors = await validate(dto);
    if (errors.length > 0) {
      res.status(400).json(errors);
      return;
    }

    await deleteArticleService({
      articleId: dto.articleId,
      userId: Number(req.user.id),
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
