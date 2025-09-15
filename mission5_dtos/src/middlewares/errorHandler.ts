import { z } from "zod";
import httpStatus from "http-status";
import express , { type Request, type Response, type NextFunction } from "express";

interface ExtendedError extends Error {
  code?: string;
}

export function errorHandler(err: ExtendedError, req: Request, res: Response, next: NextFunction) {
  if (err instanceof z.ZodError) {
    return res.status(httpStatus.BAD_REQUEST).json({ error: err.issues });
  }

  if (err.code === "P2025") {
    return res.status(httpStatus.NOT_FOUND).json({ error: "Record not found" });
  }

  console.error("unhandled Error:", err);
  return res
    .status(httpStatus.INTERNAL_SERVER_ERROR)
    .json({ error: "Internal Server Error" });
}
