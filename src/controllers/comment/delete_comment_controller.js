import { deleteCommentService } from "../../services/comment/delete_comment_service.js";

export async function deleteCommentController(req, res) {
  try {
    const commentId = parseInt(req.params.commentId);
    const user = req.user;

    await deleteCommentService({ commentId, user });
    res.send("success");
  } catch (e) {
    if (e.message === "NOT_FOUND") {
      res.status(404).json({ message: "존재하지 않는 게시물입니다." });
    }
    if (e.message === "FORBIDDEN") {
      res.status(403).json({ message: "권한이 없습니다." });
    }
    res.json({ message: "댓글 삭제에 실패했습니다." });
  }
}
