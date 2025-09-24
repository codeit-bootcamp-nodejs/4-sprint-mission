import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { ArticleDto, ProductDto, CommentDto } from "../utils/dto";

interface Param {
  id: number;
}

export async function validateArticle(
  req: Request<{}, {}, Article.Article>,
  res: Response,
  next: NextFunction
) {
  const dto = plainToInstance(ArticleDto, req.body);
  const errors = await validate(dto);

  if (errors.length > 0) {
    return res.status(400).json({
      errors: errors.map((err) => ({
        field: err.property,
        messages: Object.values(err.constraints ?? {}),
      })),
    });
  }

  next();
}

export async function validateProduct(
  req: Request<{}, {}, Product.Create["data"]>,
  res: Response,
  next: NextFunction
) {
  const dto = plainToInstance(ProductDto, req.body);
  const errors = await validate(dto);

  if (errors.length > 0) {
    return res.status(400).json({
      errors: errors.map((err) => ({
        field: err.property,
        messages: Object.values(err.constraints ?? {}),
      })),
    });
  }
  next();
}

export async function validateContent(
  req: Request<{}, {}, Comment.Comment>,
  res: Response,
  next: NextFunction
) {
  const dto = plainToInstance(CommentDto, req.body);
  const errors = await validate(dto);

  if (errors.length > 0) {
    return res.status(400).json({
      errors: errors.map((err) => ({
        field: err.property,
        messages: Object.values(err.constraints ?? {}),
      })),
    });
  }
  next();
}

export function validateId(
  req: Request<Param>,
  res: Response,
  next: NextFunction
) {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "유효하지 않은 id입니다." });
  }
  req.params.id = id;
  next();
}
