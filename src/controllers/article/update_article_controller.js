import { updateArticleService } from "../../services/article/update_article_service.js";

export async function updateArticleController(req, res) {
  try {
    const id = parseInt(req.params.id);
    const user = req.user;
    const { title, content } = req.body;
    const updateData = {};

    if (title) updateData.title = title;
    if (content) updateData.content = content;
    const result = await updateArticleService({ id, updateData, user });
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
