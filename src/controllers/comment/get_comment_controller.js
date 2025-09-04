import { getCommentService } from "../../services/comment/get_comment_service.js";

export async function getCommentController(req, res) {
  try {
    const id = parseInt(req.params.id);
    const take = parseInt(req.query.take) || 10;
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : null;

    const result = getCommentService({ id, take, cursor });
    res.json(result);
  } catch (e) {
    res.json({ message: "댓글 조회에 실패했습니다." });
  }
}
