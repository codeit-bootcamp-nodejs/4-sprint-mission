import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import type { NextFunction, Request, Response } from 'express';
import {
  CreateCommentBodyDto,
  CreateCommentParamsDto,
  type CreateCommentDto,
} from './create-comments.dto.js';
import { createCommentService } from './create-comments.service.js';

export const createCommentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Params와 Body DTO 변환 및 검증
    const params = plainToInstance(CreateCommentParamsDto, req.params);
    const body = plainToInstance(CreateCommentBodyDto, req.body);
    const dto: CreateCommentDto = {
      content: body.content,
      authorId: Number(req.user.id),
      articleId: params.articleId ?? null,
      productId: params.productId ?? null,
    };

    await validateOrReject(params);
    await validateOrReject(body);

    if (!params.articleId && !params.productId) {
      throw new Error(
        '댓글 대상이 필요합니다. articleId 또는 productId 중 하나를 지정하세요.',
      );
    }

    // Comment 생성
    const comment = await createCommentService(dto);

    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};
