import { setJwtTokens } from "../../lib/token.js";
import passports from "../../lib/passport/index.js";
import type { NextFunction, Request, Response } from "express";

export default function loginUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  passports.passport.authenticate(
    "local",
    { session: false },
    (err: Error, user: Request, info: any) => {
      console.log("로그인 시도");
      if (err) return next(err);
      if (!req.user)
        return res.status(401).json({ message: "로그인 실패, 유저 없음" });

      const tokens = setJwtTokens(String(req.user.id), res);

      res.status(200).json({
        message: "로그인",
        data: {
          accessHeader: tokens.accessToken,
          refreshHeader: tokens.refreshToken,
        },
      });
    }
  )(req, res, next);
}
