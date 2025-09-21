export interface JWTPayload {
  userId: number;
  iat?: number;
  exp?: number;
}

export interface AuthRequest {
  user?: {
    id: number;
    email: string;
    nickname: string;
  };
}