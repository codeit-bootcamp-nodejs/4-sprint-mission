import express from "express";
import { LikeController } from "../controllers/likeController.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();
const controller = new LikeController();

// 상품 좋아요
router.post("/products/:productId/like", authenticate, controller.toggleProductLike.bind(controller));

// 게시글 좋아요
router.post("/articles/:articleId/like", authenticate, controller.toggleArticleLike.bind(controller));

// 좋아요한 상품 목록 조회
router.get("/me/products", authenticate, controller.getUserLikedProducts.bind(controller));

export default router;
