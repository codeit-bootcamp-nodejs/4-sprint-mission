import { z } from "zod";
import httpStatus from "http-status";

export function errorHandler(err, req, res, next) {
  if (err instanceof z.ZodError) {
    return res.status(httpStatus.BAD_REQUEST).json({ error: err.errors });
  }

  if (err.code === "P2025") {
    return res.status(httpStatus.NOT_FOUND).json({ error: "Record not found" });
  }

  console.error("unhandled Error:", err);
  return res
    .status(httpStatus.INTERNAL_SERVER_ERROR)
    .json({ error: "Internal Server Error" });
}
