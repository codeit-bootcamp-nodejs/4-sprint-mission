import jwt from "jsonwebtoken";

export default function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return next();
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") return next();

    const token = parts[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    // 실패해도 401 내지 않고 그냥 익명으로 통과하는 next 미ㅡㄷㄹ웨어!
    next();
  }
}
