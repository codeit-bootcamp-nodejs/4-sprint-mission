import { verifyAccessToken } from '@lib/jwtToken.js';
import { redisClient } from '@lib/redis.js';
import { REDIS_KEY } from '@lib/constants.js';
import type { RequestHandler } from 'express';
import { UnauthorizedError } from '@/lib/errors.js';

export default function authentication(): RequestHandler {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('사용자 요청에 토큰 없음');
      throw new UnauthorizedError();
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedError('토큰 형식이 올바르지 않습니다.');
    }
    try {
      // 블랙리스트 먼저 체크
      const isBlacklisted = await redisClient.get(`${REDIS_KEY}:${token}`);
      if (isBlacklisted) {
        return res.status(401).json({ error: '만료된 토큰입니다. 다시 로그인해주세요.' });
      }
      req.tokenPayload = verifyAccessToken(token);
      return next();
    } catch (e) {
      console.error(e);
      throw new UnauthorizedError('토큰 인증이 유효하지 않습니다.');
    }
  };
}
