import { articleService } from '../services/article-service.js';

class ArticleController {
  // 게시글
  async getAllArticles(req, res) {
    const userId = req.user?.id || null;
    const result = await articleService.getAllArticles(req.query, userId);
    res.json(result);
  }

  async getArticleById(req, res) {
    const article = await articleService.getArticleById(req.params.id);
    res.json(article);
  }

  async createArticle(req, res) {
    const { title, content } = req.body;
    const userId = req.user.id;
    const newArticle = await articleService.createArticle(
      title,
      content,
      userId
    );
    res.status(201).json(newArticle);
  }

  async updateArticle(req, res) {
    const { id } = req.params;
    const { title, content, tags } = req.body;
    const updateData = { title, content, tags };
    const userId = req.user.id;
    const updated = await articleService.updateArticle(id, updateData, userId);
    res.json(updated);
  }

  async deleteArticle(req, res) {
    const { id } = req.params;
    const userId = req.user.id;
    const result = await articleService.deleteArticle(id, userId);
    res.status(200).json(result);
  }

  async likeArticle(req, res) {
    const userId = req.user?.id;
    const articleId = req.params.id;
    const article = await articleService.articleLike(userId, articleId);
    res.json({ data: article });
  }

  async unlikeArticle(req, res) {
    const userId = req.user?.id;
    const articleId = req.params.id;
    const article = await articleService.articleUnlike(userId, articleId);
    res.json({ data: article });
  }

  // 본인이 작성한 게시글 조회
  async getUserArticles(req, res) {
    const userId = req.user.id;
    const articles = await articleService.getUserArticles(userId);
    res.status(200).json({ articles });
  }
}

export const articleController = new ArticleController();
