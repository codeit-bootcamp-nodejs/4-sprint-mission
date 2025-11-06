import type { Request, Response, NextFunction } from 'express';

export function catchAllErrorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(err);
  res.status(500).json({ message: '서버 내부에서 에러가 발생했습니다.' });
}
