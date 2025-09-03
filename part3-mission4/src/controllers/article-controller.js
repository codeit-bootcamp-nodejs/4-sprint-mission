import { articleService } from '../services/article-service.js';

class ArticleController {
  async getAllArticles(req, res) {
    const result = await articleService.getAllArticles(req.query);
    res.json(result);
  }

  async getArticleById(req, res) {
    const article = await articleService.getArticleById(req.params.id);
    res.json(article);
  }

  async createArticle(req, res) {
    const { title, content, author } = req.body;
    const newArticle = await articleService.createArticle(
      title,
      content,
      author
    );
    res.status(201).json(newArticle);
  }

  async updateArticle(req, res) {
    const { id } = req.params;
    const { title, content, tags } = req.body;
    const updateData = { title, content, tags };
    const updated = await articleService.updateArticle(id, updateData);
    res.json(updated);
  }

  async deleteArticle(req, res) {
    const { id } = req.params;
    await articleService.deleteArticle(id);
    res.status(204).send();
  }
}

export const articleController = new ArticleController();
