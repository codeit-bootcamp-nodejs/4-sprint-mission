import { RefreshTokenSchema } from "../schemas/authSchemas.js";

export function removeSensitiveFields(user) {
  if (!user) return user;
  const { password, ...safeUser } = user;
  return safeUser;
}

export function makeAbsoluteUrl(
  relativePath,
  baseUrl = process.env.APP_BASE_URL
) {
  if (!relativePath) return null;
  return `${baseUrl}${relativePath}`;
}

// 쿠키 값 검증 - RefreshToken
export function validateRefreshTokenCookie(refreshToken) {
  const result = RefreshTokenSchema.safeParse({ refreshToken });
  if (!result.success) {
    throw new Error("유효하지 않은 refreshToken 형식입니다.");
  }
  return result.data.refreshToken;
}
