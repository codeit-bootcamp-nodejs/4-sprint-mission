import type {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";

interface AppError extends Error {
  statusCode?: number;
  errors?: unknown; // ZodError 등 상세 정보용
  name: string;
}

const errorHandler: ErrorRequestHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 기본 상태 코드와 메시지 설정
  const statusCode = err.statusCode || 500;
  const message = err.message || "서버 오류가 발생했습니다.";

  // 개발 환경에서는 요청 정보 + 에러 로그도 출력
  if (process.env.NODE_ENV !== "production") {
    console.error(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`
    );
    console.error(err);
  }

  // Zod 같은 유효성 검증 에러 처리 (선택 사항)
  if (err.name === "ZodError") {
    return res.status(400).json({
      success: false,
      error: {
        message: "요청 데이터가 유효하지 않습니다.",
        details: err.errors, // 어떤 필드에서 에러 났는지
      },
    });
  }

  // 공통 에러 응답 포맷
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
    },
  });
};
export default errorHandler;
