import { Request } from 'express';

export interface AuthRequest extends Request {
  userId?: number;
}

export interface PaginationQuery {
  limit?: number;
  offset?: number;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}
