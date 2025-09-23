import { UnauthorizedError } from '@utils/app-error.js';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import type { NextFunction, Request, Response } from 'express';
import { DeleteCommentDto } from './delete-comments.dto.js';
import { deleteCommentService } from './delete-comments.service.js';

// 댓글 삭제 컨트롤러
export const deleteCommentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    // DTO 변환 + 검증
    const dto = plainToInstance(DeleteCommentDto, req.params);
    const errors = await validate(dto);
    if (errors.length > 0) {
      res.status(400).json(errors);
      return;
    }

    await deleteCommentService({
      commentId: dto.commentId,
      userId: Number(req.user.id),
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
