import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import type { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from './create-users.dto.js';
import { createUserService } from './create-users.service.js';

export async function createUserController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const dto = plainToInstance(CreateUserDto, req.body);
    await validateOrReject(dto);

    const user = await createUserService(
      dto.email,
      dto.nickname,
      dto.password,
      dto.image ?? null,
    );

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}
