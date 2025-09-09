import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_SECRET || "access_secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh_secret";

export function generateAccessToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, ACCESS_SECRET, {
    expiresIn: "15m", // Access Token
  });
}

export function generateRefreshToken(user) {
  return jwt.sign({ id: user.id }, REFRESH_SECRET, {
    expiresIn: "7d", // Refresh Token
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}
