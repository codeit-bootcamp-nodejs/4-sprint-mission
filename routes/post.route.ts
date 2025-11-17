import { Router } from "express";
import {
  postRegisterController,
  postPutController,
  postDeleteController,
  postListController,
  postDetailController,
} from "../controllers/post.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, postRegisterController);
router.put("/:postId", authMiddleware, postPutController);
router.delete("/:postId", authMiddleware, postDeleteController);
router.get("/", postListController);
router.get("/:postId", postDetailController);

export default router;