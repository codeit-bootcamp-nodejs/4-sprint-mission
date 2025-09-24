import * as jose from "jose";
import {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
} from "./constants.js";

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
// Access Token 생성
export async function generateTokens(userId: number): Promise<Tokens> {
  const accessSecret = new TextEncoder().encode(JWT_ACCESS_TOKEN_SECRET);
  const refreshSecret = new TextEncoder().encode(JWT_REFRESH_TOKEN_SECRET);

  const accessToken = await new jose.SignJWT({ sub: userId.toString() })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1h")
    .sign(accessSecret);

  const refreshToken = await new jose.SignJWT({ sub: userId.toString() })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d")
    .sign(refreshSecret);

  return { accessToken, refreshToken };
}

// Access Token 검증
export async function verifyAccessToken(
  token: string
): Promise<{ userId: number }> {
  const { payload } = await jose.jwtVerify(
    token,
    new TextEncoder().encode(JWT_ACCESS_TOKEN_SECRET)
  );
  return { userId: Number(payload.sub) };
}

// Refresh Token 검증
export async function verifyRefreshToken(
  token: string
): Promise<{ userId: number }> {
  const { payload } = await jose.jwtVerify(
    token,
    new TextEncoder().encode(JWT_REFRESH_TOKEN_SECRET)
  );
  return { userId: Number(payload.sub) };
}
