import type { Request } from 'express';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthUser; // 여기엔 ? 없음! 무조건 존재한다고 가정
}
