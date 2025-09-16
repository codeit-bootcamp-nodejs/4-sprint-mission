import type { Request } from "express";

export interface FileRequest<
  P = unknown,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = unknown
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  files?:
    | Express.Multer.File[]
    | { [fieldname: string]: Express.Multer.File[] }
    | undefined;
}
