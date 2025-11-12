
import { verifyAccessToken } from "../utils/jwt.js";

export function authRequired(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ message: "Unauthorized" });

  try {
    const payload = verifyAccessToken(auth.slice(7));
    req.user = { id: payload.sub, email: payload.email, nickname: payload.nickname };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
