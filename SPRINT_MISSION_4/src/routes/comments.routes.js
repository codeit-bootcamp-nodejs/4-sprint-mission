import { Router } from "express";
import {
  createProductComment,
  createPostComment,
  updateComment,
  deleteComment,
} from "../controllers/comments.controller.js";
import { authRequired } from "../middlewares/auth.js";
import { ownerOnly } from "../middlewares/ownerOnly.js";
import { prisma } from "../prisma/client.js";

const router = Router();

// 상품 댓글
router.post("/products/:productId", authRequired, createProductComment);

// 게시글 댓글
router.post("/posts/:postId", authRequired, createPostComment);

// 수정 & 삭제 → 작성자만 가능
router.patch(
  "/:id",
  authRequired,
  ownerOnly((req) => prisma.comment.findUnique({ where: { id: parseInt(req.params.id) } })),
  updateComment
);
router.delete(
  "/:id",
  authRequired,
  ownerOnly((req) => prisma.comment.findUnique({ where: { id: parseInt(req.params.id) } })),
  deleteComment
);

export default router;
