import type { Request, Response, NextFunction } from "express";
import {
  createArticle,
  getArticles,
  findArticleById,
  updateArticle,
  removeArticle,
} from "../services/articleService.js";

interface GetArticleListQuery {
  offset?: string;
  limit?: string;
  title?: string;
  content?: string;
}

interface ArticleId {
  id: string;
}

interface ArticleBody {
  title?: string;
  content?: string;
}

export const getArticleList = async (
  req: Request<{}, {}, {}, GetArticleListQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const offset = req.query.offset ? Number(req.query.offset) : 0;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const title = req.query.title;
    const content = req.query.content;

    const userId = req.user?.id || null;

    const articles = await getArticles(offset, limit, title, content, userId);

    if (articles.length === 0) {
      return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
    }

    res.status(200).json(articles);
  } catch (err) {
    next(err);
  }
};

export const postArticle = async (
  req: Request<{}, {}, ArticleBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, content } = req.body;
    const userId = Number(req.user!.id);

    const article = await createArticle(title!, content!, userId);

    res.status(201).json(article);
  } catch (err) {
    next(err);
  }
};

export const getArticleById = async (
  req: Request<ArticleId>,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user?.id || null;

    const article = await findArticleById(id, userId);

    res.status(200).json(article);
  } catch (err) {
    next(err);
  }
};

export const patchArticle = async (
  req: Request<ArticleId, {}, ArticleBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const userId = Number(req.user!.id);

    const { title, content } = req.body;

    const article = await updateArticle(id, title, content, userId);

    res.status(200).json(article);
  } catch (err) {
    next(err);
  }
};

export const deleteArticle = async (
  req: Request<ArticleId>,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const userId = Number(req.user!.id);

    await removeArticle(id, userId);

    res.status(200).json({ message: `${id} 삭제 완료` });
  } catch (err) {
    next(err);
  }
};
