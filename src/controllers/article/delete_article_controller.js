import { deleteArticleService } from "../../services/article/delete_article_service.js";

export async function deleteArticleController(req, res) {
  try {
    const id = parseInt(req.params.id);
    const user = req.user;

    await deleteArticleService({ id, user });
    res.send("success");
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
