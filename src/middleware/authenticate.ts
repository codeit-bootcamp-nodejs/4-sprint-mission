import prisma from "../repository/prisma";
import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../lib/token";
import { ACCESS_TOKEN_COOKIE_NAME } from "../lib/constants";

async function authenticate(req: Request, res: Response, next: NextFunction) {
  const accessToken = req.cookies[ACCESS_TOKEN_COOKIE_NAME];
  if (!accessToken)
    return res.status(401).json({ message: "로그인이 필요합니다." });

  try {
    const { userId } = verifyAccessToken(accessToken);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    req.user = user;
  } catch (e) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

export default authenticate;
