import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import {ValidatedRequest} from"../middleware/validateReq"

export class UserValidation {
  // zod 스키마

  private static userParamsSchema = z.object({
    id: z
      .coerce
      .number()
      .min(0, { message: "Comment ID must be an integer" }),
  });

  //private static userQuerySchema(){}
  private static userBodySchema = z.object({
    email: z
      .string()
      .regex(
        /^[0-9a-zA-Z]([.-]?[0-9a-zA-Z])*@[0-9a-zA-Z]([.-]?[0-9a-zA-Z])*\.[a-zA-Z]{2,}$/i,
        "올바른 이메일 형식이 아닙니다."
      ).optional(),
    nickname: z
      .string()
      .regex(
        /^[\w\Wㄱ-ㅎㅏ-ㅣ가-힣]{3,10}$/,
        "닉네임은 3자에서 10자 이하이어야 합니다"
      ).optional(),
  });
  private static userBodyPasswordSchema = z.object({
     currentPassword: z
      .string()
      .min(8, "현재 비밀번호는 최소 8자리 이상이어야 합니다"),
      newPassword:z
      .string()
      .regex(
        /^[a-zA-Z0-9\W_]{8,15}$/,
        "비밀번호는 영문 숫자, 특수 문자 포함해서 8 +15자리 여아 합니다"
      )
  })
  // validator
  static validateUserAccessById = (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    try {
        const result = this.userParamsSchema.parse(req.params);
        (req as ValidatedRequest<typeof result>).validatedParams = result    // overwritting
        //console.log(result)
        next()
    } catch (error) {
        next(error)
    }
  };

  static validateUpdateUserPassword = (
    req:  Request,
    _res: Response,
    next: NextFunction
  ) => {
    try {
        const result = this.userBodyPasswordSchema.parse(req.body);
        (req as ValidatedRequest).validatedBody = result 
        console.log(result)
        next()
    } catch (error) {
        next(error)
    }
  };

  static validateUpdateUser = (
    req: ValidatedRequest,
    _res: Response,
    next: NextFunction
  ) => {
    try {
        const result = this.userBodySchema.parse(req.body)
        req.validatedQuery = result
        next()
    } catch (error) {
        next(error)
    }
  };

}
