import {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  NODE_ENV,
} from "./constants.js";
import type { Response } from "express";
import jwt from "jsonwebtoken";

// set cookies
export function setTokenCookies(
  res: Response,
  accessToken: string,
  refreshToken: string
): void {
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "none",
    maxAge: 1 * 60 * 60 * 1000,
  });

  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "none",
    maxAge: 1 * 60 * 60 * 1000,
  });
}

// clear
export function clearTokenCookie(res: Response) {
  res.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
}

// verify access token
export function verifyAccessToken(token: string) {
  const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
  return { id: decoded.sub }; // TODO : 인증된 유저 인덱스로 수정하기
}

// verify refresh token
export function verifyRefreshToken(token: string) {
  const decoded = jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);
  return { id: decoded.sub }; // TODO : 인증된 유저 인덱스로 수정하기
}
