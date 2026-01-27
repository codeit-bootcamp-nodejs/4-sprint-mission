import { Router } from "express";
import { toggleProductLike, togglePostLike } from "../controllers/likes.controller.js";
import { authRequired } from "../middlewares/auth.js";

const router = Router();

// 상품 좋아요/취소
router.post("/products/:productId", authRequired, toggleProductLike);

// 게시글 좋아요/취소
router.post("/posts/:postId", authRequired, togglePostLike);

export default router;
