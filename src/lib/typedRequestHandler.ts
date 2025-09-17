// src/utils/typedRequestHandler.ts
import type { Request, RequestHandler, Response, NextFunction } from "express";
import type { ParsedQs } from "qs";
import type { ParamsDictionary } from "express-serve-static-core";

/**
 * 공통 캐스팅 헬퍼
 * - 런타임 동작 없음
 * - 타입 안전성만 보장
 */
export function withTypedHandler<
  P = ParamsDictionary,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = ParsedQs
>(
  handler: (
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    res: Response,
    next: NextFunction
  ) => unknown
): RequestHandler {
  return handler as unknown as RequestHandler;
}
