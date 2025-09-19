import jwt from "jsonwebtoken";
import {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
} from "./constants.js";

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

function generateTokens(userId: number): Tokens {
  const accessToken = jwt.sign({ sub: userId }, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign({ sub: userId }, JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });
  return { accessToken, refreshToken };
}

function verifyAccessToken(token: string): { userId: number } {
  const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET) as { sub: string };
  const userId = Number(decoded.sub);

  return { userId };
}

function verifyRefreshToken(token: string): { userId: number } {
  const decoded = jwt.verify(token, JWT_REFRESH_TOKEN_SECRET) as {
    sub: string;
  };
  const userId = Number(decoded.sub);

  return { userId };
}

export { generateTokens, verifyAccessToken, verifyRefreshToken };
