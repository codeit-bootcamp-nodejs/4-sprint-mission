import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from "./constants.js";
import type { Response } from "express";

// 쿠키 설정
export function setTokenCookies(
  res: Response,
  accessToken: string,
  refreshToken: string
) {
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: false,
    maxAge: 1 * 60 * 60 * 1000, // 1 hour
    path: "/",
  });
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  });
}

// 쿠키 삭제
export function clearTokenCookies(res: Response) {
  res.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
}
