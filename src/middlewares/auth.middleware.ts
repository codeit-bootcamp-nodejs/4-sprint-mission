import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../index'; // Import prisma from index.ts
import { User as PrismaUser } from '@prisma/client';

interface DecodedToken {
  userId: number;
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 헤더에서 authorization 값 가져오기
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ message: '인증 정보가 없습니다.' });
    }

    // authorization 값에서 토큰 추출하기
    const [tokenType, token] = authorization.split(' ');
    if (tokenType !== 'Bearer') {
      return res.status(401).json({ message: '지원하지 않는 인증 방식입니다.' });
    }

    // 토큰이 없을 경우
    if (!token) {
      return res.status(401).json({ message: '인증 정보가 없습니다.' });
    }

    // 토큰 검증 (확인)
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as DecodedToken;
    const userId = decodedToken.userId;

    // 토큰 있는 userId로 조회
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return res.status(401).json({ message: '인증 정보가 유효하지 않습니다.' });
    }

    // 사용자 정보 저장
    req.user = user;
    next();
  } catch (error) {
    console.error('인증 미들웨어 에러:', error);
    if (error instanceof Error) {
      switch (error.name) {
        case 'TokenExpiredError':
          return res.status(401).json({ message: '인증 토큰이 만료되었습니다.' });
        case 'JsonWebTokenError':
          return res.status(401).json({ message: '유효하지 않은 인증 토큰입니다.' });
        default:
          return res.status(401).json({ message: '인증 정보가 유효하지 않습니다.' });
      }
    }
    next(error);
  }
};

export default authMiddleware;
