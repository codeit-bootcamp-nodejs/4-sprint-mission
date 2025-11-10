import { createArticleService } from "../../services/article/create_article_service.js";

export async function createArticleController(req, res) {
  try {
    const { title, content } = req.body;
    const user = req.user;
    if (!title || !content) {
      return res.status(400).json({ message: "title과 content가 필요합니다." });
    }
    const result = await createArticleService({ title, content, user });
    res.status(201).json(result);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
