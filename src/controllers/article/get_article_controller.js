import { getArticleService } from "../../services/article/get_article_service.js";

export async function getArticleController(req, res) {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search?.toString() || "";
    const user = req.user;

    const result = await getArticleService(offset, limit, search, user);
    res.json(result);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
