import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      userId: number;
      email?: string;
      nickname?: string;
    };
  }
}

export function authMiddleware(req:Request, res: Response, next: NextFunction): void {
  try {
    // 요청 헤더에서 토큰 꺼내기
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ success: false, message: " 토큰이 없습니다." });
      return;
    }

    // "Bearer 토큰값" 형태 에서 "토큰값"만 분리
    const token = authHeader.split(" ")[1];

    // 토큰 검증 ( 비밀키는 .env에 저장)
    const decoded = jwt.verify(token!, process.env.JWT_SECRET!) as unknown as JwtPayload & { userId: string; email?: string };

    // 토큰 안에 있는 유저 정보
    req.user = {
       ...decoded,
        userId: Number(decoded.userId),
    };
    console.log("decoded token:", decoded);

    next();
  } catch (err: unknown) {
    console.error("JWT 검증 실패:", err instanceof Error ? err.message: err);
    res.status(401).json({ success: false, message: "유효하지 않는 토큰입니다." });
  }
}

