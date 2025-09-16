import type { RequestHandler } from "express";

export type Controller<
  P = unknown,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = unknown
> = RequestHandler<P, ResBody, ReqBody, ReqQuery>;
