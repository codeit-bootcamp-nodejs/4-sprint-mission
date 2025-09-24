import type { Request, Response, NextFunction } from "express";

// HttpError 클래스 정의 (statusCode 속성 포함)
export class HttpError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode = 500) {
    super(message)
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, HttpError.prototype);  
  }
}

// 에러 핸들러
export function errorHandler(
  err: Error | HttpError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error("서버 에러 발생:", err);

  const statusCode = (err instanceof HttpError ? err.statusCode : 500);

  res. status(statusCode).json({
    message: err.message || "서버에서 문제가 발생했습니다.",
  });
}