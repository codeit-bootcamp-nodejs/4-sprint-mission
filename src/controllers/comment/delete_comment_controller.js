import { deleteCommentService } from "../../services/comment/delete_comment_service.js";

export async function deleteCommentController(req, res) {
  try {
    const commentId = parseInt(req.params.commentId);
    await deleteCommentService(commentId);
    res.send("success");
  } catch (e) {
    res.json({ message: "댓글 삭제에 실패했습니다." });
  }
}
