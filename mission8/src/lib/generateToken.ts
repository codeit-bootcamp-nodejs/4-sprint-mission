import {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
} from "./constants.js";
import jwt from "jsonwebtoken";

export function generateToken({ id, email }: { id: number; email: string }) {
  const accessToken = jwt.sign({ sub: id, email }, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: "30min",
  });

  const refreshToken = jwt.sign({ sub: id }, JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });
  return { accessToken, refreshToken };
}
