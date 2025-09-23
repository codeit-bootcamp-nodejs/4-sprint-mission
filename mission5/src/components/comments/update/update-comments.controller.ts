import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import type { NextFunction, Request, Response } from 'express';
import {
  UpdateCommentBodyDto,
  type UpdateCommentDto,
  UpdateCommentParamsDto,
} from './update-comments.dto.js';
import { updateCommentService } from './update-comments.service.js';

export const updateCommentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Params와 Body DTO 변환 및 검증
    const params = plainToInstance(UpdateCommentParamsDto, req.params);
    const body = plainToInstance(UpdateCommentBodyDto, req.body);

    await validateOrReject(params);
    await validateOrReject(body);

    // Service용 DTO 생성
    const dto: UpdateCommentDto = {
      commentId: params.commentId,
      userId: Number(req.user.id),
      content: body.content,
    };

    const updatedComment = await updateCommentService(dto);

    res.json(updatedComment);
  } catch (err) {
    next(err);
  }
};
