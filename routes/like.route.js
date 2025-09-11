import { Router } from "express";
import {
  guessLikedPostController,
  guessLikedProductController,
  likePostController,
  likeProductController,
  likeProductListController,
} from "../controllers/like.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/products/:productId", authMiddleware, likeProductController);
router.post("/posts/:postId", authMiddleware, likePostController);
router.get("/products/:productId", authMiddleware, guessLikedProductController);
router.get("/posts/:postId", authMiddleware, guessLikedPostController);
router.get("/listProductlist", authMiddleware, likeProductListController);

export default router;
