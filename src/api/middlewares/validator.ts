import { validate } from "class-validator";
import type { Request, Response, NextFunction } from "express";
import type { DtoClass } from "../types/express.d.ts";

// req.body 검증 및 DTO 생성
export const validateDto = <T extends object>(dtoClass: DtoClass<T>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // 1. req.body를 DTO 클래스의 인스턴스로 변환
    const dtoObject = dtoClass.from(req.body);

    // 2. DTO 인스턴스의 유효성 검사
    const errors = await validate(dtoObject);

    if (errors.length > 0) {
      const errorMessages = errors.map((error) => {
        return Object.values(error.constraints || {}).join(", ");
      });
      return res.status(400).json({ errors: errorMessages });
    }

    // 3. 완성된 DTO 객체를 req.body에 할당
    req.body = dtoObject;
    next();
  };
};

// req.params 검증
export const validateParams = <T extends object>(dtoClass: DtoClass<T>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoObject = dtoClass.from(req.params);

    const errors = await validate(dtoObject);

    if (errors.length > 0) {
      const errorMessages = errors.map((error) => {
        return Object.values(error.constraints || {}).join(", ");
      });
      return res.status(400).json({ errors: errorMessages });
    }

    next();
  };
};
