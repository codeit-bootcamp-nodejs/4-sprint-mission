import { getArticleByIdService } from "../../services/article/get_article_by_id_service.js";

export async function getArticleByIdController(req, res) {
  try {
    const id = parseInt(req.params.id);
    const user = req.user;
    const result = await getArticleByIdService(id, user);
    res.json(result);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
