// src/middlewares/errorHandler.js
import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (err: CustomError, _req: Request, res: Response, next: NextFunction): void => {
  console.error('Error:', err);

  if (res.headersSent) {
    next(err);
    return;
  }

  // JSON 파싱 오류 처리
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ error: 'Invalid JSON format' });
    return;
  }

  // Multer 파일 필터 오류
  if (err instanceof Error && err.message.includes('Only jpeg/png images')) {
    res.status(400).json({ error: err.message });
    return;
  }

  // Prisma에서 not found 오류
  if (err.code === 'P2025') {
    res.status(404).json({ error: 'Resource not found' });
    return;
  }

  const status = err.statusCode || 500;
  const payload =
    process.env['NODE_ENV'] === 'production'
      ? { error: 'Internal Server Error' }
      : { error: err.message, code: err.code };

  res.status(status).json(payload);
};
