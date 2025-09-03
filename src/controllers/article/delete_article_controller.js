import { deleteArticleService } from "../../services/article/delete_article_service.js";

export async function deleteArticleController(req, res) {
  try {
    const id = parseInt(req.params.id);
    deleteArticleService(id);
    res.send("success");
  } catch (e) {
    res.json({ message: e.message });
  }
}
