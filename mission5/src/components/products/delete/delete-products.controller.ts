import { UnauthorizedError } from '@utils/app-error.js';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import type { NextFunction, Request, Response } from 'express';
import { DeleteProductDto } from './delete-product.dto.js';
import { deleteProductService } from './delete-products.service.js';

export const deleteProductController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    // DTO 변환 + 검증
    const dto = plainToInstance(DeleteProductDto, req.params);
    const errors = await validate(dto);
    if (errors.length > 0) {
      res.status(400).json(errors);
      return;
    }

    await deleteProductService({
      productId: dto.productId,
      userId: Number(req.user.id),
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
