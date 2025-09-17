import { Router } from "express";
import {
  commentRegisterProductController,
  commentRegisterPostController,
  commentPutController,
  commentDeleteController,
  commentListController,
} from "../controllers/comment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/products", authMiddleware, commentRegisterProductController);
router.post("/posts", authMiddleware, commentRegisterPostController);
router.put("/:commentId", authMiddleware, commentPutController);
router.delete("/:commentId", authMiddleware, commentDeleteController);
router.get("/", authMiddleware, commentListController);

export default router;
