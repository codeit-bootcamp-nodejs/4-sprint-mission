import { Router } from "express";
import {
  PostRegisterController,
  PostPutController,
  PostDeleteController,
  PostListController,
} from "../controllers/post.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, PostRegisterController);
router.put("/:postId", authMiddleware, PostPutController);
router.delete("/:postId", authMiddleware, PostDeleteController);
router.get("/", authMiddleware, PostListController)
export default router;