import { UnauthorizedError } from '@utils/app-error.js';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import type { NextFunction, Request, Response } from 'express';
import {
  UpdateProductBodyDto,
  UpdateProductParamsDto,
  type UpdateProductDto,
} from './update-products.dto.js';
import { updateProductService } from './update-products.service.js';

export const updateProductController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    // Params, Body 변환 및 검증
    const params = plainToInstance(UpdateProductParamsDto, req.params);
    const body = plainToInstance(UpdateProductBodyDto, req.body);

    await validateOrReject(params);
    await validateOrReject(body);

    // Prisma용 data 객체를 undefined 필드 제외하고 구성
    const data: Partial<Omit<UpdateProductDto, 'productId' | 'userId'>> = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.description !== undefined) data.description = body.description;
    if (body.price !== undefined) data.price = body.price;
    if (body.tags !== undefined) data.tags = body.tags;

    const updated = await updateProductService({
      productId: Number(params.productId),
      userId: Number(req.user.id),
      ...data,
    });

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};
