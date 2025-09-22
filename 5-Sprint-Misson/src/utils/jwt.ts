import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "@prisma/client";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh_secret";
const ACCESS_TOKEN_EXPIRES_IN = "15m"; // 15분
const REFRESH_TOKEN_EXPIRES_IN = "7d"; // 7일

// Access Token 생성
export function generateAccessToken(user: User): string {
  return jwt.sign(
    { id: user.id, email: user.email }, // payload
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  );
}

// Refresh Token 생성
export function generateRefreshToken(user: User): string {
  return jwt.sign(
    { id: user.id },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );
}

// Refresh Token 검증
export function verifyRefreshToken(token: string): JwtPayload | string {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
}

// Access Token 검증 (추가 기능)
export function verifyAccessToken(token: string): JwtPayload | string {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
}
