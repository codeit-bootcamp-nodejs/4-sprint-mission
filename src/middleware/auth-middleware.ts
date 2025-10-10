import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw new Error('인증 정보가 없습니다.');
    }

    const [tokenType, tokenValue] = authorization.split(' ');
    if (tokenType !== 'Bearer') {
      throw new Error('지원하지 않는 인증 방식입니다.');
    }

    const decoded = jwt.verify(
      tokenValue,
      process.env.JWT_SECRET!,
    ) as jwt.JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw new Error('인증 정보와 일치하는 사용자가 없습니다.');
    }

    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword; // 타입 오류 없이 할당 가능

    next();
  } catch (error: any) {
    if (
      error.name === 'TokenExpiredError' ||
      error.name === 'JsonWebTokenError'
    ) {
      return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    }
    next(error);
  }
};