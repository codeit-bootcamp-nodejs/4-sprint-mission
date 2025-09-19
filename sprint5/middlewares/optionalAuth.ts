import type { Request, Response, NextFunction } from "express";
import passport from "passport";

export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "access-token",
    { session: false },
    (err: Error | null, user: Express.User, info: object | null) => {
      if (user) {
        req.user = user; // 인증 성공한 경우만 user 저장
      }
      next(); // 인증 실패여도 계속 진행
    }
  )(req, res, next);
};
