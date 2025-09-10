import jwt from "jsonwebtoken";
import prisma from "../libs/prismaClient.js";
import type { Request, Response, NextFunction } from "express";
import type { CustomError } from "src/api/types/error.js";
import env from "../config/env.js";

export default async function authenticate(req: Request, res: Response, next: NextFunction) {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    const error: CustomError = new Error("인증 토큰이 필요합니다.");
    error.statusCode = 401;
    return next(error);
  }

  try {
    const decoded = jwt.verify(accessToken, env.ACCESS_TOKEN_SECRET);
    if (typeof decoded === "string" || !decoded.id) {
      const error: CustomError = new Error("유효하지 않은 Access Token입니다.");
      error.statusCode = 403;
      throw error;
    }
    const userId = decoded.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      const error: CustomError = new Error("토큰에 해당하는 사용자를 찾을 수 없습니다.");
      error.statusCode = 404;
      return next(error);
    }

    req.user = user;
    next();
  } catch (err) {
    let message;
    if (err.name === "TokenExpiredError") {
      message = "토큰이 만료되었습니다.";
    } else {
      message = "유효하지 않은 토큰입니다.";
    }
    const error: CustomError = new Error(message);
    error.statusCode = 401;
    next(error);
  }
}
