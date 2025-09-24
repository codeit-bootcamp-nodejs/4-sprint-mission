import { RefreshTokenSchema } from "../schemas/authSchemas.js";
import type { User as PrismaUser } from "@prisma/client";
import type { Request } from "express";

export function removeSensitiveFields(
  user: Partial<PrismaUser> | null | undefined
) {
  if (!user) return user;
  const { password, ...safeUser } = user;
  return safeUser as Omit<PrismaUser, "password">;
}

export function makeAbsoluteUrl(
  relativePath: string | null | undefined,
  req?: Request
) {
  if (!relativePath) return null;
  const baseUrl = req
    ? `${req.protocol}://${req.get("host")}`
    : process.env.APP_BASE_URL!;
  return `${baseUrl}${relativePath}`;
}

// 쿠키 값 검증 - RefreshToken
export function validateRefreshTokenCookie(refreshToken: unknown) {
  const result = RefreshTokenSchema.safeParse({ refreshToken });
  if (!result.success) {
    throw new Error("유효하지 않은 refreshToken 형식입니다.");
  }
  return result.data.refreshToken;
}
