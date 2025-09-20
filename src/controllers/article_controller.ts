import { Request, Response } from "express";
import {
  createArticleService,
  deleteArticleService,
  getArticleByIdService,
  getArticleService,
  updateArticleService,
} from "../services/article_service";
import { AppError } from "../utils/error";

interface ArticleParam {
  id: string;
}

interface ArticleQuery {
  offset?: string;
  limit?: string;
  search?: string;
}

export async function createArticleController(
  req: Request<{}, {}, Article.Create>,
  res: Response
) {
  try {
    const { title, content } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }
    const result = await createArticleService({ title, content, user });
    res.status(201).json(result);
  } catch (e) {
    res.status(500).json({ message: (e as Error).message });
  }
}

export async function deleteArticleController(
  req: Request<ArticleParam>,
  res: Response
) {
  try {
    const id = parseInt(req.params.id);
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }
    await deleteArticleService({ id, user });
    res.send("success");
  } catch (e) {
    if (e instanceof AppError) {
      res.status(e.statusCode).json({ message: e.message });
    } else {
      res.status(500).json({ message: "서버 에러" });
    }
  }
}

export async function getArticleByIdController(
  req: Request<ArticleParam>,
  res: Response
) {
  try {
    const id = parseInt(req.params.id);
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }
    const result = await getArticleByIdService({ id, user });
    res.json(result);
  } catch (e) {
    res.status(500).json({ message: (e as Error).message });
  }
}

export async function getArticleController(
  req: Request<{}, {}, {}, ArticleQuery>,
  res: Response
) {
  try {
    const offset = parseInt(req.query.offset ?? "0");
    const limit = parseInt(req.query.limit ?? "10");
    const search = req.query.search?.toString() || "";
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }
    const result = await getArticleService({ offset, limit, search, user });
    res.json(result);
  } catch (e) {
    res.status(500).json({ message: (e as Error).message });
  }
}

export async function updateArticleController(
  req: Request<ArticleParam, {}, Article.Update["updateData"]>,
  res: Response
) {
  try {
    const id = parseInt(req.params.id);
    const user = req.user;
    const { title, content } = req.body;
    const updateData: Article.Update["updateData"] = {};

    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (!user) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }
    const result = await updateArticleService({ id, updateData, user });
    res.send(result);
  } catch (e) {
    if (e instanceof AppError) {
      res.status(e.statusCode).json({ message: e.message });
    } else {
      res.status(500).json({ message: "서버 에러" });
    }
  }
}
