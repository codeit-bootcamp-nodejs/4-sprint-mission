import { updateArticleService } from "../../services/article/update_article_service.js";

export async function updateArticleController(req, res) {
  try {
    const id = parseInt(req.params.id);
    const { title, content } = req.body;
    const updateData = {};

    if (title) updateData.title = title;
    if (content) updateData.content = content;
    const result = await updateArticleService({ id, updateData });
    res.send(result);
  } catch (e) {
    res.json({ message: e.message });
  }
}
