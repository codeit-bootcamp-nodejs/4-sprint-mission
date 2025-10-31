import type { ErrorDetail } from '@/types/error.types.js';

export abstract class AppError extends Error {
  public statusCode: number;
  public details?: ErrorDetail[];

  constructor(message: string, statusCode: number, details?: ErrorDetail[]) {
    super(message);
    this.statusCode = statusCode;
    this.details = details ?? [];
  }
}
