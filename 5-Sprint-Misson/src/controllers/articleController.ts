import { Request, Response } from "express";
import { ArticlesService } from "../services/articlesService";

const service = new ArticlesService();

export class ArticlesController {
  async create(req: Request, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: "인증 필요" });
      const { title, content } = req.body;
      const article = await service.create({ title, content, userId: req.user.id });
      res.status(201).json(article);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const article = await service.getById(Number(req.params.id));
      if (!article) return res.status(404).json({ error: "게시글 없음" });
      res.json(article);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: "인증 필요" });
      const { title, content } = req.body;
      const updated = await service.update({
        id: Number(req.params.id),
        title,
        content,
        userId: req.user.id
      });
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: "인증 필요" });
      await service.delete(Number(req.params.id), req.user.id);
      res.status(204).send();
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const page = Number(req.query.page ?? 1);
      const pageSize = Number(req.query.pageSize ?? 10);
      const sort = (req.query.sort as "recent" | "asc") ?? "recent";
      const search = (req.query.search as string) ?? "";

      const result = await service.list(page, pageSize, sort, search);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
