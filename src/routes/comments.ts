import express from 'express';
import prisma from '../lib/prisma.js'
import auth from '../../src/middlewares/auth.js'
import type { Request, Response } from "express";

const router = express.Router();

// 상품 댓글 생성
router.post("/product/:productId", auth, async (
    req: Request<{ productId: string }, any, { content: string }>,
    res: Response): Promise<Response> => {
    try {
      const userId = req.userId;
      const { productId } = req.params;
      const { content } = req.body;

      if (!userId) return res.status(401).json({ error: "Unauthorized" });
      if (!content) return res.status(400).json({ error: "댓글 필요" });

      const id = Number(productId);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid productId" });

      const product = await prisma.product.findUnique({ where: { id } });
      if (!product) return res.status(404).json({ error: "제품을 찾을 수 없음" });

      const comment = await prisma.comment.create({
        data: { content, authorId: userId, productId: id },
      });

      return res.status(201).json({ comment });
    } catch (err: any) {
      console.error("상품 댓글 생성 오류:", err);
      return res.status(500).json({ error: err.message });
    }
  }
);

// 게시글 댓글 생성
router.post("/post/:postId", auth, async (
    req: Request<{ postId: string }, any, { content: string }>,
    res: Response): Promise<Response> => {
    try {
      const userId = req.userId;
      const { postId } = req.params;
      const { content } = req.body;

      if (!userId) return res.status(401).json({ error: "Unauthorized" });
      if (!content) return res.status(400).json({ error: "content required" });

      const id = Number(postId);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid postId" });

      const post = await prisma.post.findUnique({ where: { id } });
      if (!post) return res.status(404).json({ error: "Post not found" });

      const comment = await prisma.comment.create({
        data: { content, authorId: userId, postId: id },
      });

      return res.status(201).json({ comment });
    } catch (err: any) {
      console.error("게시글 댓글 생성 오류:", err);
      return res.status(500).json({ error: err.message });
    }
  }
);

// 댓글 수정
router.patch("/:id", auth, async (
    req: Request<{ id: string }, any, { content: string }>,
    res: Response): Promise<Response> => {
    try {
      const userId = req.userId;
      const { id } = req.params;
      const { content } = req.body;

      if (!userId) return res.status(401).json({ error: "Unauthorized" });
      if (!content) return res.status(400).json({ error: "content required" });

      const commentId = Number(id);
      if (isNaN(commentId)) return res.status(400).json({ error: "Invalid id" });

      const comment = await prisma.comment.findUnique({ where: { id: commentId } });
      if (!comment) return res.status(404).json({ error: "Comment not found" });
      if (comment.authorId !== userId)
        return res.status(403).json({ error: "Not authorized" });

      const updated = await prisma.comment.update({
        where: { id: commentId },
        data: { content },
      });

      return res.json({ comment: updated });
    } catch (err: any) {
      console.error("댓글 수정 오류:", err);
      return res.status(500).json({ error: err.message });
    }
  }
);

// 댓글 삭제
router.delete("/:id", auth, async(
  req: Request<{ id: string }>,
  res: Response): Promise<Response> => {
    try {
      const userId = req.userId;
      const { id } = req.params;

      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const commentId = Number(id);
      if (isNaN(commentId)) return res.status(400).json({ error: "Invalid id" });

      const comment = await prisma.comment.findUnique({ where: { id: commentId } });
      if (!comment) return res.status(404).json({ error: "Comment not found" });
      if (comment.authorId !== userId)
        return res.status(403).json({ error: "Not authorized" });

      await prisma.comment.delete({ where: { id: commentId } });

      return res.json({ message: "Comment deleted" });
    } catch (err: any) {
      console.error("댓글 삭제 오류:", err);
      return res.status(500).json({ error: err.message });
    }
  }
);

export default router;