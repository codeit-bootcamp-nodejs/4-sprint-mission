import {
  ArticleLikeService,
  ProductLikeService,
} from "../services/like_service.js";

export async function ArticleLikeController(req, res) {
  try {
    const id = parseInt(req.params.id);
    const user = req.user;

    const result = await ArticleLikeService({ id, user });
    res.status(201).json(result);
  } catch (e) {
    res.json({ message: e.message });
  }
}

export async function ProductLikeController(req, res) {
  try {
    const id = parseInt(req.params.id);
    const user = req.user;

    const result = await ProductLikeService({ id, user });
    res.status(201).json(result);
  } catch (e) {
    res.json({ message: "상품 좋아요 실패" });
  }
}
