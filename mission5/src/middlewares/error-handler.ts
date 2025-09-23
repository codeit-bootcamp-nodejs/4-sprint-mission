import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AppError } from '@utils/app-error.js';
import type { NextFunction, Request, Response } from 'express';

// Prisma 에러 처리
const handlePrismaError = (err: PrismaClientKnownRequestError): AppError => {
  switch (err.code) {
    case 'P2002':
      return new AppError(`Duplicate field value: ${err.meta?.target}`, 400);
    case 'P2014':
      return new AppError(`Invalid ID: ${err.meta?.target}`, 400);
    case 'P2003':
      return new AppError(`Invalid input data: ${err.meta?.target}`, 400);
    default:
      return new AppError(`Something went wrong: ${err.message}`, 500, false);
  }
};

// JWT 에러 처리
const handleJWTError = () =>
  new AppError('Invalid token, please login again', 401);
const handleJWTExpiredError = () =>
  new AppError('Token has expired, please login again', 401);

// Express 전역 에러 핸들러
const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let error = err;

  // Prisma 에러
  if (err instanceof PrismaClientKnownRequestError) {
    error = handlePrismaError(err);
  }

  // JWT 에러
  if (err.name === 'JsonWebTokenError') {
    error = handleJWTError();
  }
  if (err.name === 'TokenExpiredError') {
    error = handleJWTExpiredError();
  }

  const appError =
    error instanceof AppError
      ? error
      : new AppError('Unexpected error', 500, false);

  if (process.env.NODE_ENV === 'development') {
    return res.status(appError.statusCode).json({
      status: appError.isOperational ? 'fail' : 'error',
      message: appError.message,
      stack: appError.stack,
    });
  }

  // production
  if (appError.isOperational) {
    return res.status(appError.statusCode).json({
      status: 'fail',
      message: appError.message,
    });
  }

  console.error('ERROR 💥', error);
  return res
    .status(500)
    .json({ status: 'error', message: 'Something went wrong' });
};

export default errorHandler;
