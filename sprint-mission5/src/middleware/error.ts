import { ZodError } from 'zod';
import type { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

class AsyncError extends Error {
  code: string;
  issues?: unknown;

  constructor(message: string, code: string = "UNKNOWN_ERROR", issues?: unknown) {
    super(message);
    this.name = "AsyncError";
    this.code = code;
    this.issues = issues;
    Object.setPrototypeOf(this, AsyncError.prototype);
  }
}

function isAsyncHandler(e: unknown): e is AsyncError {
  return (
    e instanceof AsyncError
    || (
      typeof e === "object"
      && e !== null
      && "message" in e && typeof (e as any).message === "string"
      && "code" in e && typeof (e as any).code === "string"
    )
  );
}

function errorHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (e: unknown) {
      if (e instanceof ZodError) {
        res.status(400).json({ message: e.message });
      } else if (
        (e instanceof Error && (e.name === "StructError" || e.name === "ValidationError"))
      ) {
        res.status(400).json({ message: (e as Error).message });
      } else if (isAsyncHandler(e)) {
        res.status(400).json({ message: e.message, code: e.code, issues: e.issues });
      } else if (e instanceof Error) {
        res.status(500).json({ message: e.message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  };
}

export { errorHandler };