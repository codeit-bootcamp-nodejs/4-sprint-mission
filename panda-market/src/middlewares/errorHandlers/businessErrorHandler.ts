import type { Request, Response, NextFunction } from 'express';
import { AppError } from '@/lib/appError.js';
import jwt from 'jsonwebtoken';

export function businessErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // AppError의 인스턴스인지 확인
  if (err instanceof AppError) {
    console.error(
      `===== 비즈니스 로직 에러 발생 =====`,
      `에러 이름: ${err.name}`, // 예: BadRequestError
      `에러 코드: ${err.statusCode}`,
      `에러 메시지: ${err.message}`, // 위에서 설정한 구체적인 메시지
      `요청 URL:  ${req.originalUrl}`,
      `요청 메서드: ${req.method}`,
      `요청 헤더 (Authorization): ${req.headers.authorization}`, // 토큰 관련 문제 확인
      `요청 쿼리: ${JSON.stringify(req.query)}`, // 쿼리 관련 문제 확인
      `에러 스택: ${err.stack}`, // 에러가 발생한 코드 위치 추적
      `===================`,
    );

    return res.status(err.statusCode).json({
      message: err.message,
      details: err.details ?? [], // details가 undefined이면 빈 배열
    });
  } else if (err instanceof jwt.TokenExpiredError) {
    return res.status(401).json({
      name: err.name,
      message: err.message,
    });
  }
  // AppError가 아니라면, 처리할 수 없는 에러이므로 다음 핸들러로
  return next(err);
}
