import { Request } from "express";

export interface ValidatedRequest<TBody = any, TParams = any, TQuery = any> extends Request {
  validatedBody?: TBody;
  validatedParams?: TParams;
  validatedQuery?: TQuery;
}