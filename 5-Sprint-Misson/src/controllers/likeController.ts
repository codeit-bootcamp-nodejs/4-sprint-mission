import { Request, Response } from "express";
import { LikeService } from "../services/likeService";

export class LikeController {
  private service = new LikeService();

  async toggleProductLike(req: Request, res: Response) {
    try {
      const productId = Number(req.params.productId);
      const result = await this.service.toggleProductLike(req.user!.id, productId);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: "상품 좋아요 처리 실패" });
    }
  }

  async toggleArticleLike(req: Request, res: Response) {
    try {
      const articleId = Number(req.params.articleId);
      const result = await this.service.toggleArticleLike(req.user!.id, articleId);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: "게시글 좋아요 처리 실패" });
    }
  }

  async getUserLikedProducts(req: Request, res: Response) {
    try {
      const products = await this.service.getUserLikedProducts(req.user!.id);
      res.json(products);
    } catch (err: any) {
      res.status(500).json({ error: "좋아요 상품 조회 실패" });
    }
  }
}
