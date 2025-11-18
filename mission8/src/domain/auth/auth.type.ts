export interface CreateRefreshTokenInput {
  token: string;
  userId: number;
  expiresAt: Date;
}

export interface TokenPayload {
  userId: number;
  iat?: number;
  exp?: number;
}

export interface registerInputData {
  email: string;
  password: string;
  username: string;
}
