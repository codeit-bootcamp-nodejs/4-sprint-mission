import { Prisma } from '@prisma/client';
import type { ErrorRequestHandler } from 'express';
import multer from 'multer';

/** ---- Custom Errors ---- */
export class AppError extends Error {
  constructor(message: string, public statusCode = 500, name = 'AppError') {
    super(message);
    this.name = name;
  }
}
export class BadRequestError extends AppError {
  constructor(message = '잘못된 요청입니다.') {
    super(message, 400, 'BadRequestError');
  }
}
export class NotFoundError extends AppError {
  constructor(message = '리소스를 찾을 수 없습니다.') {
    super(message, 404, 'NotFoundError');
  }
}
export class ForbiddenError extends AppError {
  constructor(message = '권한이 없습니다.') {
    super(message, 403, 'ForbiddenError');
  }
}
export class UnauthorizedError extends AppError {
  constructor(message = '로그인이 필요합니다.') {
    super(message, 401, 'UnauthorizedError');
  }
}

/** ---- HttpError Guard ---- */
interface HttpError extends Error {
  statusCode?: number;
}
function isHttpError(err: unknown): err is HttpError {
  return (
    !!err && typeof err === 'object' && 'message' in err && 'statusCode' in err
  );
}

/** ---- Prisma mapping helpers ---- */
type PrismaMapped = {
  status: number;
  error: string;
  message: string;
  code: string;
};
type PrismaLike = { code?: string; meta?: { target?: unknown } };

/** 실제 Prisma KnownRequestError 전용(널 아님) */
function mapPrismaKnown(
  err: Prisma.PrismaClientKnownRequestError
): PrismaMapped {
  const code = err.code;
  const rawTarget = err.meta?.target;
  const fields =
    Array.isArray(rawTarget) && rawTarget.every((s) => typeof s === 'string')
      ? (rawTarget as string[])
      : [];

  let status = 400;
  let message = `DB 요청 에러 (${code})`;
  const error = 'PrismaClientKnownRequestError';

  if (code === 'P2002') {
    if (fields.includes('username')) message = '이미 사용 중인 닉네임입니다.';
    else if (fields.includes('email')) message = '이미 사용 중인 이메일입니다.';
    else message = `중복된 값이 존재합니다. (${fields.join(', ')})`;
    status = 409;
  } else if (code === 'P2003') {
    message = '잘못된 참조로 인해 작업이 불가능합니다.';
    status = 400;
  } else if (code === 'P2025') {
    message = '대상을 찾을 수 없습니다.';
    status = 404;
  }
  return { status, error, message, code };
}

/** 가짜/래핑된 Prisma-like 에러 폴백(없으면 null) */
function mapPrismaLike(err: unknown): PrismaMapped | null {
  const code = (err as PrismaLike)?.code;
  if (typeof code !== 'string') return null;

  const rawTarget = (err as PrismaLike)?.meta?.target;
  const fields =
    Array.isArray(rawTarget) && rawTarget.every((s) => typeof s === 'string')
      ? (rawTarget as string[])
      : [];

  let status = 400;
  let message = `DB 요청 에러 (${code})`;
  const error = 'PrismaClientKnownRequestError';

  if (code === 'P2002') {
    if (fields.includes('username')) message = '이미 사용 중인 닉네임입니다.';
    else if (fields.includes('email')) message = '이미 사용 중인 이메일입니다.';
    else message = `중복된 값이 존재합니다. (${fields.join(', ')})`;
    status = 409;
  } else if (code === 'P2003') {
    message = '잘못된 참조로 인해 작업이 불가능합니다.';
    status = 400;
  } else if (code === 'P2025') {
    message = '대상을 찾을 수 없습니다.';
    status = 404;
  }
  return { status, error, message, code };
}

/** ---- Multer mapping ---- */
function mapMulter(err: multer.MulterError) {
  let message = err.message;
  if (err.code === 'LIMIT_FILE_SIZE')
    message = '파일 크기가 너무 큽니다. (최대 5MB)';
  else if (err.code === 'LIMIT_UNEXPECTED_FILE')
    message = '허용되지 않는 파일 필드입니다.';
  else if (err.code === 'LIMIT_FILE_COUNT')
    message = '최대 5개의 파일만 업로드할 수 있습니다.';
  return { status: 400, error: 'MulterError', message, code: err.code };
}

/** ---- Error Handler ---- */
const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  console.error((err as Error)?.stack ?? err);

  const isProd = process.env.NODE_ENV === 'production';
  const isTest = process.env.NODE_ENV === 'test';

  if (!isTest) {
    console.error((err as Error)?.stack ?? err);
  }

  // 기본값
  let status = 500;
  let error = (err as Error)?.name || 'InternalServerError';
  let message = (err as Error)?.message || '서버 오류';
  let code: string | undefined;

  // 1) 커스텀 AppError
  if (err instanceof AppError) {
    status = err.statusCode;
    error = err.name;
    message = err.message;
  }
  // 2) HttpError
  else if (isHttpError(err)) {
    status = err.statusCode ?? 500;
    error = (err as Error).name || error;
    message = err.message ?? message;
  }
  // 3) Prisma KnownRequestError (확정 매핑: null 아님)
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const m = mapPrismaKnown(err);
    status = m.status;
    error = m.error;
    message = m.message;
    code = m.code;
  }
  // 4) MulterError
  else if (err instanceof multer.MulterError) {
    const m = mapMulter(err);
    status = m.status;
    error = m.error;
    message = m.message;
    code = m.code;
  }

  // 5) 폴백: Prisma-like(code만 있는 가짜/래핑) 매핑 시도
  if (!code) {
    const m2 = mapPrismaLike(err);
    if (m2) {
      status = m2.status;
      error = m2.error;
      message = m2.message;
      code = m2.code;
    }
  }

  // 공통 응답 payload (단 한 번만 선언)
  const payload: {
    status: number;
    error: string;
    message: string;
    code?: string;
    stack?: string;
    path?: string;
    method?: string;
  } = { status, error, message };

  if (!isProd) {
    if (code !== undefined) payload.code = code;
    payload.path = req.originalUrl;
    payload.method = req.method;
    const st = (err as Error).stack;
    if (st !== undefined) payload.stack = st;
  } else {
    if (code !== undefined) payload.code = code;
  }

  return res.status(status).json(payload);
};

export default errorHandler;
