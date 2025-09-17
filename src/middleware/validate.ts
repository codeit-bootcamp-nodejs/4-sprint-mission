import { Request, Response, NextFunction } from "express";

interface Param {
  id: number;
}

export function validateArticle(
  req: Request<{}, {}, Article.Article>,
  res: Response,
  next: NextFunction
) {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "제목과 내용은 필수입니다." });
  }
  next();
}

export function validateProduct(
  req: Request<{}, {}, Product.Create["data"]>,
  res: Response,
  next: NextFunction
) {
  const { name, description, price, tags } = req.body;
  if (!name || !description || price === undefined || !tags) {
    return res
      .status(400)
      .json({ error: "이름, 설명, 가격, 태그는 필수입니다." });
  }
  if (typeof price !== "number" || price < 0 || !Number.isInteger(price)) {
    return res.status(400).json({ error: "가격은 0 이상의 정수여야 합니다." });
  }
  next();
}

export function validateContent(
  req: Request<{}, {}, Comment.Comment>,
  res: Response,
  next: NextFunction
) {
  const { content } = req.body;
  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "댓글 내용은 필수입니다." });
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
