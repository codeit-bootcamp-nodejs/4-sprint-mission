import prisma from '@config/prisma.js';
import type { NextFunction, Request, Response } from 'express';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from '../../../../config/constants.js';

export const deleteSessionController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];

    if (refreshToken) {
      // DB에서 Refresh Token 폐기
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });
    }

    // 쿠키 제거
    res.clearCookie(ACCESS_TOKEN_COOKIE_NAME, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    return res.json({ message: 'logged out' });
  } catch (err) {
    return next(err);
  }
};
