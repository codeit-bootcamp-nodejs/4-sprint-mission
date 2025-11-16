import type { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = err.status || 500;
  console.error("Error:", err);

  if (status === 400) {
    return res
      .status(status)
      .json({ error: err.message || "잘못된 요청입니다." });
  } else if (status === 401) {
    return res
      .status(status)
      .json({ error: err.message || "인증에 실패했습니다." });
  } else if (status === 403) {
    return res
      .status(status)
      .json({ error: err.message || "접근 권한이 없습니다." });
  } else if (status === 404 || err.code === "P2025") {
    return res
      .status(404)
      .json({ error: err.message || "리소스를 찾을 수 없습니다." });
  } else if (status === 409) {
    return res
      .status(status)
      .json({ message: err.message || "이미 존재하는 데이터입니다." });
  } else {
    return res.status(500).json({ error: "서버 오류" });
  }
}
