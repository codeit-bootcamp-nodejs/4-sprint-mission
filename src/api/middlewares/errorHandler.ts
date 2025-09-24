import type { Request, Response, NextFunction } from "express";
import type { CustomError } from "../types/error.js";

export default function errorHandler(err: CustomError, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack);

  if (res.headersSent) return next(err);

  const code = err.statusCode ?? err.status;
  if (code) {
    res.status(code).json({ error: err.message });
  } else {
    res.status(500).json({ error: "서버 오류" });
  }
}
