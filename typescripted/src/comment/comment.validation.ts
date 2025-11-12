import { Request, Response, NextFunction } from "express";
import z from "zod";

export default class CommentValidation {
  // zod 스키마
  private static CommentBodySchema = z.object({
    content: z.string().min(1, { message: "Comment content is required" }),
    title: z.string().min(1, { message: "Comment title is required" }),
  });

  private static commentIdParamSchema = z.object({
    id: z.coerce.number().min(0, { message: "Comment ID must be an integer" }),
  });

  private static commentQuerySchema = z.object({
    type: z
      .string({ message: "Comment type must be an string" })
      .transform((val) => {
        val.toUpperCase();
      }),
    take: z
      .coerce
      .number()
      .min(10, { message: "take number must be the bigger than 10" }),
    page: z
      .coerce
      .number()
      .min(1, { message: "page number must be the bigger than 1" }),
    prouductId: z
      .coerce
      .number()
      .min(0, { message: "product 인덱스는 0 보다 크거나 같아야 합니다" }),
    articleId: z
      .coerce
      .number()
      .min(0, { message: "article 인덱스는 0 보다 크거나 같아야 합니다" }),
})
  // validator

  static validateCommentById = (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    try {
        const result = this.commentIdParamSchema.safeParse(req.params)
        next(result);
    } catch (error) {
        next(); 
    }      
  };

  static validateGetCommentList = (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    try {
        const result = this.commentQuerySchema.safeParse(req.query)
        next();
    } catch (error) {
        next(error)
        }
    }
  static validateCreateComment = (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    try {
        const result = this.CommentBodySchema.safeParse(req.body);
        next();
    } catch (error) {
        next(error);
    }    
  };
}
