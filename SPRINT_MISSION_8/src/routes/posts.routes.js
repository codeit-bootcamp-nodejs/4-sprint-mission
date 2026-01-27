import { Router } from "express";
import {
  createPost,
  listPosts,
  getPost,
  updatePost,
  deletePost,
} from "../controllers/posts.controller.js";
import { authRequired } from "../middlewares/auth.js";
import { ownerOnly } from "../middlewares/ownerOnly.js";
import { prisma } from "../prisma/client.js";

const router = Router();

// 전체 게시글 목록 & 등록
router.get("/", listPosts);
router.post("/", authRequired, createPost);

// 단일 게시글 조회
router.get("/:id", getPost);

// 수정 & 삭제 → 작성자만 가능
router.patch(
  "/:id",
  authRequired,
  ownerOnly((req) => prisma.post.findUnique({ where: { id: parseInt(req.params.id) } })),
  updatePost
);
router.delete(
  "/:id",
  authRequired,
  ownerOnly((req) => prisma.post.findUnique({ where: { id: parseInt(req.params.id) } })),
  deletePost
);

export default router;
