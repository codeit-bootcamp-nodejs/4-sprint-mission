import { Request, Response } from "express";
import {
  ArticleLikeService,
  ProductLikeService,
} from "../services/like_service.js";

interface LikeParam {
  id?: string;
}

export async function ArticleLikeController(
  req: Request<LikeParam>,
  res: Response
) {
  try {
    const id = parseInt(req.params.id ?? "1");
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }
    const result = await ArticleLikeService({ id, user });
    res.status(201).json(result);
  } catch (e) {
    res.json({ message: (e as Error).message });
  }
}

export async function ProductLikeController(
  req: Request<LikeParam>,
  res: Response
) {
  try {
    const id = parseInt(req.params.id ?? "1");
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }
    const result = await ProductLikeService({ id, user });
    res.status(201).json(result);
  } catch (e) {
    res.json({ message: "상품 좋아요 실패" });
  }
}
