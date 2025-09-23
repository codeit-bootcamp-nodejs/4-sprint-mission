import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import type { NextFunction, Request, Response } from 'express';
import { UpdateUserDto } from './update-users.dto.js';
import { updateUserService } from './update-users.service.js';

export const updateUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const dto = plainToInstance(UpdateUserDto, req.body);
    await validateOrReject(dto);

    const updatedUser = await updateUserService(req.user.id, dto);
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};
