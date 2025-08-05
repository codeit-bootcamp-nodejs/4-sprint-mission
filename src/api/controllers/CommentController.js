import CommentService from "../services/CommentService.js";

const CommentController = {
  async createComment(req, res) {
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
      console.error(err);
      res.status(500).json({ error: "댓글 등록 실패" });
    }
  },

  async updateComment(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const comment = await CommentService.updateComment(
        Number(id),
        updateData
      );
      res.status(201).json(comment);
    } catch (err) {
      if (err.code === "P2025") {
        res.status(404).json({ error: "해당 댓글이 존재하지 않음" });
      }
      console.error(err);
      res.status(500).json({ error: "댓글 수정 실패" });
    }
  },

  async deleteComment(req, res) {
    try {
      const { id } = req.params;
      await CommentService.deleteComment(Number(id));
      res.status(201).json({ success: "댓글 삭제" });
    } catch (err) {
      if (err.code === "P2025") {
        res.status(404).json({ error: "해당 댓글이 존재하지 않음" });
      }
      console.error(err);
      res.status(500).json({ error: "댓글 삭제 실패" });
    }
  },
  async findManyComment(req, res) {
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
      console.error(err);
      res.status(500).json({ error: "댓글 목록 조회 실패" });
    }
  },
};

export default CommentController;
