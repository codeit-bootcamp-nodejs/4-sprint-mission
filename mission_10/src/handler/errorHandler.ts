import type { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = function (err, req, res, next) {
  console.error(`[ERROR] ${err.stack || err.message}`);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error!";

  res.status(statusCode).json({ message });
}

export default errorHandler;