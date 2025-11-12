import type { RequestHandler } from 'express';

export const requestLogger: RequestHandler = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[백엔드] ${res.statusCode} ${req.method} ${req.originalUrl} - ${duration}ms`
    );
  });

  next();
};
