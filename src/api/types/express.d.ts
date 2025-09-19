import { Request } from "express";
import { AuthenticatedUser } from "./user";
import type { number } from "zod";

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      file?: Multer.File;
    }
  }
}

export interface RequestWithDto<T> extends Request {
  body: T;
}

export type DtoClass<T> = {
  from(data: any): T;
};

// 목록 조회 파라미터 타입 정의
export interface FindManyParams {
  offset?: number;
  limit?: number;
  order?: string;
  keyword?: string;
}
