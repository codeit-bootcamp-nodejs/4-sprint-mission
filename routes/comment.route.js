import { Router } from "express";
import {
  CommentRegisterProductController,
  CommentRegisterPostController,
  CommentPutController,
  CommentDeleteController,
  CommentListController,
} from "../controllers/comment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/products", authMiddleware, CommentRegisterProductController);
router.post("/posts", authMiddleware, CommentRegisterPostController);
router.put("/:commentId", authMiddleware, CommentPutController);
router.delete("/:commentId", authMiddleware, CommentDeleteController);
router.get("/", authMiddleware, CommentListController)
export default router;
