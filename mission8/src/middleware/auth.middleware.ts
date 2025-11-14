import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { authConfig } from '../config/auth.config.js';
import { MESSAGE, STATUS_CODE } from '../constants/constant.js';
import type { TokenPayload } from '../domain/auth/auth.type.js';
import { HttpException } from '../utils/http-exception.js';
import logger from '../utils/logger.js';

const accessTokenSecretKey = authConfig.accessTokenSecretKey;

const isTokenPayload = (decoded: unknown): decoded is TokenPayload => {
  return (
    typeof decoded === 'object' &&
    decoded !== null &&
    'userId' in decoded &&
    typeof (decoded as TokenPayload).userId === 'number'
  );
};

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    logger.debug({
      message: '인증 헤더가 없거나 토큰이 제공되지 않았습니다',
      path: req.originalUrl,
      method: req.method,
      ip: req.ip,
    });
    return next(new HttpException(STATUS_CODE.UNAUTHORIZED, MESSAGE.unauthorized));
  }

  try {
    const decoded = jwt.verify(token, String(accessTokenSecretKey));

    if (!isTokenPayload(decoded)) {
      logger.debug({
        message: 'JWT 페이로드가 잘못되었습니다',
        path: req.originalUrl,
        method: req.method,
        ip: req.ip,
        payload: decoded,
      });
      return next(new HttpException(STATUS_CODE.UNAUTHORIZED, MESSAGE.unauthorized));
    }

    req.user = { id: Number(decoded['userId']) };

    logger.info({
      message: '사용자 인증',
      path: req.originalUrl,
      method: req.method,
      userId: req.user.id,
    });

    next();
  } catch (err) {
    logger.debug({
      message: 'JWT 확인 실패',
      path: req.originalUrl,
      method: req.method,
      error: err,
    });
    next(err);
  }
};
