import type { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'; // Import Prisma error type

class CustomError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

interface ErrorWithStatus extends Error {
    status?: number;
}

const errorHandler = (err: ErrorWithStatus, _req: Request, res: Response, _next: NextFunction) => {
    let status = err.status || 500;
    let message = err.message || '서버 오류가 발생했습니다.';

    // Handle Prisma Known Request Errors
    if (err instanceof PrismaClientKnownRequestError) {
        switch (err.code) {
            case 'P2002': // Unique constraint violation
                status = 409; // Conflict
                message = '이미 존재하는 데이터입니다.';
                break;
            case 'P2025': // Record not found
                status = 404; // Not Found
                message = '요청한 데이터를 찾을 수 없습니다.';
                break;
            // Add more Prisma error codes as needed
            default:
                status = 400; // Bad Request for other known Prisma errors
                message = `데이터베이스 오류: ${err.message}`;
                break;
        }
    }

    // 콘솔에 에러 로그 출력 (개발용)
    console.error(err);

    res.status(status).json({
        message: message,
    });
};

export default errorHandler;
export { CustomError };
