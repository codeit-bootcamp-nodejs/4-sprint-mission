import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../index'; // Import prisma from index.ts

interface DecodedToken {
  userId: number;
}

// 선택적 인증 미들웨어
// 인증에 성공하면 사용자 정보를 추가하고 실패해도 에러없이 다음 미들웨어 진행
const optionalAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return next();
    }

    const [tokenType, token] = authorization.split(' ');
    if (tokenType !== 'Bearer' || !token) {
      return next();
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as DecodedToken;
    const user = await prisma.user.findUnique({
      where: { id: decodedToken.userId },
    });

    if (user) {
      req.user = user;
    }
  } catch (error) {
    // 에러 발생 시에도 다음 미들웨어로 진행 (선택적 인증이므로)
    console.error('선택적 인증 미들웨어 에러:', error);
  }

  return next();
};

export default optionalAuthMiddleware;
