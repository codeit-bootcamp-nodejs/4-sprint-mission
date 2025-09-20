import { updateCommentService } from "../../services/comment/update_comment_service.js";

export async function updateCommentController(req, res) {
  try {
    const commentId = parseInt(req.params.commentId);
    const user = req.user;
    const { content } = req.body;
    const updateData = {};

    if (content) updateData.content = content;
    const result = await updateCommentService({ commentId, updateData, user });
    res.send(result);
  } catch (e) {
    if (e.message === "NOT_FOUND") {
      res.status(404).json({ message: "존재하지 않는 게시물입니다." });
    }
    if (e.message === "FORBIDDEN") {
      res.status(403).json({ message: "권한이 없습니다." });
    }
    res.json({ message: e.message });
  }
}
