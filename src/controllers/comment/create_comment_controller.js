import { createCommentService } from "../../services/comment/create_comment_service.js";

export async function createCommentController(req, res) {
  try {
    const id = parseInt(req.params.id);
    const { content } = req.body;

    const result = createCommentService({ id, content });
    res.json(result);
  } catch (e) {
    req.json({ message: "댓글 작성에 실패했습니다." });
  }
}
