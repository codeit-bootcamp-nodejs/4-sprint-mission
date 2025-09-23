import { UnauthorizedError } from '@utils/app-error.js';
import type { NextFunction, Request, Response } from 'express';
import { getUserService } from './get-users.service.js';

export async function getUserController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const user = await getUserService(Number(req.user.id));
    res.status(200).json({ status: 'success', data: user });
  } catch (err) {
    next(err);
  }
}
