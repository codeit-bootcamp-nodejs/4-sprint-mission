import { BadRequestError } from '@utils/app-error.js';
import type { NextFunction, Request, Response } from 'express';
import { refreshTokenService } from './tokens.service.js';

export const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    if (!refreshToken) {
      throw new BadRequestError('Refresh Token 필요');
    }

    const accessToken = await refreshTokenService(refreshToken);

    return res.status(200).json({ accessToken });
  } catch (err) {
    return next(err);
  }
};
