import { Response, Request, NextFunction } from "express";
import { ArticleService } from "./article.service";
export interface ValidatedRequest<T = any> extends Request {
  validatedBody?: T;
  validatedParams?: { id: number };
  validatedQuery?: { take: number; page: number; keyword?:"content" | "title" };
}
export interface ReqQuery {
  take?: number;
  page?: number;
  keyword?: "content" | "title"
}

export interface RequestParams {
  id: number;
}
export interface RequestBody {
  content: string;
  title: string;
}
const articleService = new ArticleService();
export class ArticleController {
  async getAticleListCont(query: ReqQuery, res: Response, next: NextFunction) {
    console.log("Received");
    try {
      const { take, page, keyword } = query as any;
      const skip: number = (page - 1) * take;
      const result = await articleService.getArticleList({
        take,
        skip,
        keyword,
      });
      return res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getArticleCont(
    params: RequestParams,
    res: Response,
    next: NextFunction
  ) {
    try {
      const articleId = Number(params.id);
      const result = await articleService.getArticle({ articleId });
      return res.json({ success: true, data: result });
    } catch (error) {
      if (!res.headersSent) {
        next(error); // 에러 핸들러에서 처리
      }
    }
  }
  async createArticleCont(
    body: RequestBody,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { title, content } = body as any;
      const result = await articleService.createArticle({ title, content });
      return res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async patchArticleCont(
    body: RequestBody,
    params: RequestParams,
    res: Response,
    next: NextFunction
  ) {
    try {
      const articleId = Number(params.id) as any;
      const { title, content } = body as any;
      const modifiedData = await articleService.pacthArticle({
        articleId,
        title,
        content,
      });
      return res.json({ success: true, data: modifiedData });
    } catch (error) {
      next(error);
    }
  }

  async poppedArticleCont(
    params: RequestParams,
    res: Response,
    next: NextFunction
  ) {
    try {
      const articleId = params.id;
      await articleService.poppedArticle({ articleId });
      return res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }
}
