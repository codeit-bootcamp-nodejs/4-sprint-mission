import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import type { NextFunction, Request, Response } from 'express';
import { UpdateUserPasswordDto } from './update-users-password.dto.js';
import { updateUserPasswordService } from './update-users-password.service.js';

export const updateUserPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // DTO 변환 + 검증
    const dto = plainToInstance(UpdateUserPasswordDto, req.body);
    await validateOrReject(dto);

    const updatedUser = await updateUserPasswordService(
      req.user.id,
      dto.currentPassword,
      dto.newPassword,
    );

    res
      .status(200)
      .json({ message: '비밀번호가 변경되었습니다.', user: updatedUser });

    return;
  } catch (err) {
    next(err);
    return;
  }
};
