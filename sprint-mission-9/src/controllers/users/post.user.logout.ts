import type { NextFunction, Request, Response } from "express";
import { clearJwtTokenCookies } from "../../lib/token.js";
import createHttpError from "http-errors";

export default function logoutUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return next(createHttpError(401, "비인가 유저"));
  }

  clearJwtTokenCookies(res);

  res.status(200).json({ message: "로그아웃" });
}
