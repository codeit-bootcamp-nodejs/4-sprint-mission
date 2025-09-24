import type { Request } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { ParsedQs } from "qs";

export type ExpressQuery = ParsedQs;

export interface FileRequest<
  P extends Record<string, any> = ParamsDictionary,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = ExpressQuery
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  files?:
    | Express.Multer.File[]
    | { [fieldname: string]: Express.Multer.File[] };
}
