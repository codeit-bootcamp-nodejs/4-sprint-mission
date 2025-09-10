import LikeService from "../services/LikeService.js";
import type { Request, Response, NextFunction } from "express";

const LikeController = {
  async toggleLike(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.user;
      const { type, id } = req.params;

      if (type !== "product" && type !== "article") {
        return res.status(400).json({ error: "type은 product 혹은 article이어야 합니다." });
      }

      const contentId = Number(id);

      const result = await LikeService.toggleLike(userId, type, contentId);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },
};

export default LikeController;
