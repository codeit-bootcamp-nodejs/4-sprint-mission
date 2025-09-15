import { Request, Response, NextFunction } from "express";
import status from "http-status";
import { LikeService } from "../services/likeService";

const likeService = new LikeService();

export class LikeController {
  async likeArticle(req: Request, res: Response, next: NextFunction) {
    if (!req.user) return res.status(status.UNAUTHORIZED).json({ message: "Unauthorized" });
    try {
      const result = await likeService.likeArticle(req.user.id, Number(req.params.id));
      res.status(status.OK).json({ message: "Like toggled", isLiked: result.like });
    } catch (err: any) {
      if (err.message === "ARTICLE_NOT_FOUND") return res.status(status.NOT_FOUND).json({ message: "Article not found" });
      next(err);
    }
  }

  async likeProduct(req: Request, res: Response, next: NextFunction) {
    if (!req.user) return res.status(status.UNAUTHORIZED).json({ message: "Unauthorized" });
    try {
      const result = await likeService.likeProduct(req.user.id, Number(req.params.id));
      res.status(status.OK).json({ message: "Like toggled", isLiked: result.like });
    } catch (err: any) {
      if (err.message === "PRODUCT_NOT_FOUND") return res.status(status.NOT_FOUND).json({ message: "Product not found" });
      next(err);
    }
  }

  async getLikedArticles(req: Request, res: Response, next: NextFunction) {
    if (!req.user) return res.status(status.UNAUTHORIZED).json({ message: "Unauthorized" });
    try {
      const likedArticles = await likeService.getLikedArticles(req.user.id);
      const articles = likedArticles.map((l) => ({ ...l.article, isLiked: true }));
      res.status(status.OK).json(articles);
    } catch (err) {
      next(err);
    }
  }

  async getLikedProducts(req: Request, res: Response, next: NextFunction) {
    if (!req.user) return res.status(status.UNAUTHORIZED).json({ message: "Unauthorized" });
    try {
      const likedProducts = await likeService.getLikedProducts(req.user.id);
      const products = likedProducts.map((l) => ({ ...l.product, isLiked: true }));
      res.status(status.OK).json(products);
    } catch (err) {
      next(err);
    }
  }
}