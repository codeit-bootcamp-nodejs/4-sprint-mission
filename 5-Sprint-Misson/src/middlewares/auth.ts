import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma";

const ACCESS_SECRET = process.env.ACCESS_SECRET || "change_this_secret";

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header && header.startsWith("Bearer ") ? header.split(" ")[1] : undefined;

  if (!token) return res.status(401).json({ error: "인증 필요" });

  try {
    const payload = jwt.verify(token, ACCESS_SECRET) as { id: number; email?: string };
    const user = await prisma.user.findUnique({ where: { id: payload.id } });

    if (!user) return res.status(401).json({ error: "유효하지 않은 토큰" });

    req.user = user; 
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: "토큰 검증 실패" });
  }
}
