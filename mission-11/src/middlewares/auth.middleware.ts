import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.util.js';
import { UnauthorizedError } from '../errors/http-error.js';

export default async function (req: Request, res: Response, next: NextFunction) {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw new UnauthorizedError('인증 정보가 없습니다.');
    }

    const [tokenType, token] = authorization.split(' ');
    if (tokenType !== 'Bearer' || !token) {
      throw new UnauthorizedError('지원하지 않는 토큰 형식입니다.');
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY!);

    if (
      typeof decodedToken !== 'object' ||
      decodedToken === null ||
      !('userId' in decodedToken)
    ) {
      throw new UnauthorizedError('인증 정보가 유효하지 않습니다.');
    }

    const userId = (decodedToken as { userId: number }).userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new UnauthorizedError('인증정보와 일치하는 사용자가 없습니다.');
    }

    req.user = user;
    next();
  } catch (err: any) {
    // JWT 관련 에러들을 일관되게 처리
    if (
      err instanceof SyntaxError ||
      err.name === 'TokenExpiredError' ||
      err.name === 'JsonWebTokenError'
    ) {
      next(new UnauthorizedError('인증 정보가 유효하지 않습니다.'));
    } else {
      next(err);
    }
  }
}