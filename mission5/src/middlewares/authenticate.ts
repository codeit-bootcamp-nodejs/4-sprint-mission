import { UnauthorizedError } from '@utils/app-error.js';
import type { NextFunction, Request, Response } from 'express';
import prisma from '../config/prisma.js';
import { verifyAccessToken } from '../config/token.js';

interface JwtPayload {
  userId: number;
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      nickname?: string;
      image?: string | null;
    }
    interface Request {
      user: User;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    let token = req.cookies?.accessToken;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) token = authHeader.split(' ')[1];
    }

    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) token = authHeader.split(' ')[1];

    if (!token && req.cookies?.accessToken) token = req.cookies.accessToken;

    if (!token) {
      throw new UnauthorizedError('토큰이 필요합니다.');
    }

    const payload = verifyAccessToken(token) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new UnauthorizedError('유효하지 않은 토큰입니다.');
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
