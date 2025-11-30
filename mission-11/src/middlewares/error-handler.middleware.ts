import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors/http-error.js';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(`[${req.method}] ${req.originalUrl} :`, err);

  // HttpError의 인스턴스인지 확인
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }

  // 그 외의 모든 에러는 500 서버 에러로 처리
  return res
    .status(500)
    .json({ message: '서버 내부 오류가 발생했습니다.' });
};
