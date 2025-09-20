import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const authMiddleware = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw new Error('인증 정보가 없습니다.');
    }

    const [tokenType, tokenValue] = authorization.split(' ');
    if (tokenType !== 'Bearer') {
      throw new Error('지원하지 않는 인증 방식입니다.');
    }

    const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw new Error('인증 정보와 일치하는 사용자가 없습니다.');
    }

    delete user.password; // 보안을 위해 비밀번호 정보 제거
    req.user = user; // req 객체에 사용자 정보 추가

    next();
  } catch (error) {
    // 토큰 만료 또는 검증 실패 시 에러 처리
    if (
      error.name === 'TokenExpiredError' ||
      error.name === 'JsonWebTokenError'
    ) {
      return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    }
    next(error);
  }
};
