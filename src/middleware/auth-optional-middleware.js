import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// 토큰이 있으면 사용자를 확인하고, 없으면 그냥 통과시키는 미들웨어
export const authOptionalMiddleware = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (authorization) {
      const [tokenType, tokenValue] = authorization.split(' ');
      if (tokenType === 'Bearer') {
        const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
        });

        if (user) {
          delete user.password;
          req.user = user;
        }
      }
    }
  } catch (error) {
    // 토큰 검증에 실패해도 에러를 발생시키지 않고 그냥 넘어갑니다.
    console.error('Optional Auth Error:', error.message);
  }
  next();
};
