import jwt from "jsonwebtoken";
import { ACCESS_SECRET, ACCESS_EXPIRES } from "../config/env.js";

export function signAccessToken(payload) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}
