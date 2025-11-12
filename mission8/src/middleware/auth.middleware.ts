import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { authConfig } from '../config/auth.config.js';
import { MESSAGE, STATUS_CODE } from '../constants/constant.js';
import { HttpException } from '../utils/exception.js';
import logger from '../utils/logger.js';

const accessTokenSecretKey = authConfig.accessTokenSecretKey;

interface TokenPayload {
  userId: number;
  iat?: number;
  exp?: number;
}

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
      message: 'Authorization header missing or token not provided',
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
        message: 'JWT payload invalid',
        path: req.originalUrl,
        method: req.method,
        ip: req.ip,
        payload: decoded,
      });
      return next(new HttpException(STATUS_CODE.UNAUTHORIZED, MESSAGE.unauthorized));
    }

    req.user = { id: String(decoded['userId']) };

    logger.info({
      message: 'User authenticated',
      path: req.originalUrl,
      method: req.method,
      userId: req.user.id,
    });

    next();
  } catch (err) {
    logger.debug({
      message: 'JWT verification failed',
      path: req.originalUrl,
      method: req.method,
      error: err,
    });
    next(err);
  }
};
