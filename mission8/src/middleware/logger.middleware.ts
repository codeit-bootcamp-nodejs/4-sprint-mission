import type { NextFunction, Request, Response } from 'express';

import logger from '../utils/logger.js';

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  logger.info({
    type: 'request',
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });

  res.on('finish', () => {
    const duration = Date.now() - start;

    logger.info({
      type: 'response',
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    });
  });

  next();
};
