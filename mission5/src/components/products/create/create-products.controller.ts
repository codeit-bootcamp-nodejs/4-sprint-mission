import { UnauthorizedError } from '@utils/app-error.js';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import type { NextFunction, Request, Response } from 'express';
import { CreateProductDto } from './create-products.dto.js';
import { createProductSerializer } from './create-products.serializer.js';
import { createProductService } from './create-products.service.js';

export const createProductController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const dto = plainToInstance(CreateProductDto, {
      ...req.body,
      authorId: req.user.id,
    });

    const errors = await validate(dto);
    if (errors.length > 0) {
      res.status(400).json(errors);
      return;
    }

    const product = await createProductService(dto);
    res.status(201).json(createProductSerializer(product));
    return;
  } catch (err) {
    next(err);
  }
};
