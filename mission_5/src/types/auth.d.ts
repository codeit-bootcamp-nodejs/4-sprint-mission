export interface JwtPayload {
  userId: number;
  iat?: number;
  exp?: number;
}
