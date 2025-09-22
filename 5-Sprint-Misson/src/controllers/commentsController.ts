import { Request, Response } from "express";
import { CommentsService } from "../services/commentsService";
import { CreateCommentDto, UpdateCommentDto } from "../dtos/comment.dto";

export class CommentsController {
  private service = new CommentsService();

  async createForProduct(req: Request, res: Response) {
    try {
      const dto: CreateCommentDto = req.body;
      const comment = await this.service.createForProduct(req.user!.id, Number(req.params.productId), dto.content);
      res.status(201).json(comment);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "상품 댓글 등록 실패" });
    }
  }

  async createForArticle(req: Request, res: Response) {
    try {
      const dto: CreateCommentDto = req.body;
      const comment = await this.service.createForArticle(req.user!.id, Number(req.params.articleId), dto.content);
      res.status(201).json(comment);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "게시글 댓글 등록 실패" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const dto: UpdateCommentDto = req.body;
      const updated = await this.service.updateComment(Number(req.params.id), req.user!.id, dto.content);
      res.json(updated);
    } catch (err: any) {
      res.status(err.message === "권한 없음" ? 403 : 500).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await this.service.deleteComment(Number(req.params.id), req.user!.id);
      res.json({ message: "삭제 완료" });
    } catch (err: any) {
      res.status(err.message === "권한 없음" ? 403 : 500).json({ error: err.message });
    }
  }

  async listForProduct(req: Request, res: Response) {
    try {
      const { cursor, take } = req.query;
      const comments = await this.service.listForProduct(
        Number(req.params.productId),
        cursor ? Number(cursor) : undefined,
        take ? Number(take) : 10
      );
      res.json(comments);
    } catch (err: any) {
      res.status(500).json({ error: "조회 실패" });
    }
  }

  async listForArticle(req: Request, res: Response) {
    try {
      const { cursor, take } = req.query;
      const comments = await this.service.listForArticle(
        Number(req.params.articleId),
        cursor ? Number(cursor) : undefined,
        take ? Number(take) : 10
      );
      res.json(comments);
    } catch (err: any) {
      res.status(500).json({ error: "조회 실패" });
    }
  }
}
