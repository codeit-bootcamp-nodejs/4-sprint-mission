import type { Request } from 'express';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthUser;
}
