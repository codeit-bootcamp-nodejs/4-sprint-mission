import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/auth";
import prisma from "../utils/prisma";
import {
  AuthenticatedRequest,
  OptionalAuthRequest,
  UserResponse,
} from "../types";

// 인증이 필요한 API를 위한 미들웨어
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers["authorization"] as string;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        error: "Access token이 필요합니다.",
      });
      return;
    }

    // 토큰 검증
    const decoded = verifyAccessToken(token);
    if (!decoded) {
      res.status(401).json({
        error: "유효하지 않은 토큰입니다.",
      });
      return;
    }

    // 유저 존재 여부 확인
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      res.status(401).json({
        error: "존재하지 않는 사용자입니다.",
      });
      return;
    }

    // res.locals 객체에 사용자 정보 추가
    res.locals.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      error: "서버 내부 오류가 발생했습니다.",
    });
  }
};

// 선택적 인증 미들웨어 (로그인한 사용자 정보가 있으면 추가, 없어도 통과)
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader =
      req.headers.authorization && req.headers.authorization.split(" ")[1];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.locals.user = null;
      next();
      return;
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      res.locals.user = null;
      next();
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.locals.user = user ? (user as UserResponse) : null;
    next();
  } catch (error) {
    console.error("Optional auth middleware error:", error);
    res.locals.user = null;
    next();
  }
};
