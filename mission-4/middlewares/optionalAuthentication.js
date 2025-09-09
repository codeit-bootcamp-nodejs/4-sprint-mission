import { verifyAccessToken } from '../lib/jwtToken.js';
import prisma from '../lib/prisma.js';
import { redisClient } from '../lib/redis.js';
import { REDIS_KEY } from '../lib/constants.js';

export default function optionalAuthentication() {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }
    const token = authHeader.split(' ')[1];
    try {
      // 블랙리스트 먼저 체크
      const isBlacklisted = await redisClient.get(`${REDIS_KEY}:${token}`);

      if (isBlacklisted) {
        return res.status(401).json({ error: '로그아웃된 토큰입니다. 다시 로그인해주세요.' });
      }
      const result = verifyAccessToken(token);
      const user = await prisma.user.findUniqueOrThrow({
        where: {
          id: result.id,
        },
        select: {
          id: true,
          email: true,
          nickname: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      req.user = user;
      next();
    } catch (e) {
      console.error(e);
      const err = new Error('인증이 유효하지 않습니다.');
      err.statusCode = 401; // Unauthorized
      throw err;
    }
  };
}
