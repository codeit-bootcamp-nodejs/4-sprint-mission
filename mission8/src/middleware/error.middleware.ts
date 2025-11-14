import type { NextFunction, Request, Response } from 'express';

import { MESSAGE } from '../constants/constant.js';
import type { HttpException } from '../utils/http-exception.js';
import logger from '../utils/logger.js';

export const errorMiddleware = (err: HttpException, req: Request, res: Response, _next: NextFunction) => {
  logger.error({
    message: err.message,
    status: err.status || 500,
    method: req.method,
    url: req.originalUrl,
    timestamp: new Date().toISOString(),
  });

  const status = err.status || 500;
  const message = status === 500 ? MESSAGE.serverError : err.message;

  res.status(status).send({ status, message });
};
