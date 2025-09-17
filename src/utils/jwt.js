import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcrypt";

// 액세스 토큰
export function signAccessToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || "1h" }
  );
}

// 리프레시 토큰 (평문 발급)
export function signRefreshToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES || "7d" }
  );
}

// 토큰 해시(저장용) — 빠르고 일관된 조회를 위해 sha256 사용
export function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// (옵션) 해시 대신 bcrypt도 가능 — 검증시 compare 필요
export async function hashTokenBcrypt(token) {
  return bcrypt.hash(token, 10);
}
