import CommentService from "../services/CommentService.js";

const CommentController = {
  async createComment(req, res, next) {
    try {
      const { content, productId, articleId } = req.body;

      if (!content || (!productId && !articleId)) {
        return res.status(400).json({ error: "댓글과 게시글 ID는 필수값" });
      }

      if (productId && articleId) {
        return res
          .status(400)
          .json({ error: "productId 혹은 articleId 둘 중 하나만 있어야 함" });
      }

      const newComment = await CommentService.createComment({
        content,
        productId,
        articleId,
      });
      res.status(201).json(newComment);
    } catch (err) {
      if (err.code === "P2003") {
        const target = req.body.productId ? "상품" : "게시글";
        return res.status(404).json({ error: `존재하지 않는 ${target}` });
      }
      next(err);
    }
  },

  async updateComment(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const comment = await CommentService.updateComment(
        Number(id),
        updateData
      );
      res.status(201).json(comment, next);
    } catch (err) {
      if (err.code === "P2025") {
        res.status(404).json({ error: "해당 댓글이 존재하지 않음" });
      }
      next(err);
    }
  },

  async deleteComment(req, res, next) {
    try {
      const { id } = req.params;
      await CommentService.deleteComment(Number(id));
      res.status(201).json({ success: "댓글 삭제" });
    } catch (err) {
      if (err.code === "P2025") {
        res.status(404).json({ error: "해당 댓글이 존재하지 않음" });
      }
      next(err);
    }
  },
  async findManyComment(req, res, next) {
    try {
      const { productId, articleId, cursor, limit = 10 } = req.query;

      if (productId && articleId) {
        return res
          .status(400)
          .json({ error: "productId 혹은 articleId 둘 중 하나만 있어야 함" });
      }

      const comments = await CommentService.findManyComment({
        productId: Number(productId),
        articleId: Number(articleId),
        cursor,
        limit,
      });

      res.status(200).json(comments);
    } catch (err) {
      next(err);
    }
  },
};

export default CommentController;
