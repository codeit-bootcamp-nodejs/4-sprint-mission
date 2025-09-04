import { articleService } from '../services/article-service.js';
import { commentService } from '../services/comment-service.js';

class ArticleController {
  // 게시글
  async getAllArticles(req, res) {
    const result = await articleService.getAllArticles(req.query);
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

  // 댓글
  async getComments(req, res) {
    const { id } = req.params; // articleId
    const comments = await commentService.getCommentsByArticleId(id);
    res.json(comments);
  }

  async createComment(req, res) {
    const { id } = req.params; // articleId
    const { content } = req.body;
    const userId = req.user.id;
    const newComment = await commentService.createArticleComment(
      id,
      content,
      userId
    );
    res.status(201).json(newComment);
  }

  async getCommentById(req, res) {
    const { id, commentId } = req.params;
    const comment = await commentService.getCommentByIdAndArticleId(
      id,
      commentId
    );
    res.json(comment);
  }

  async updateComment(req, res) {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    const updated = await commentService.updateComment(
      commentId,
      userId,
      content
    );
    res.json(updated);
  }

  async deleteComment(req, res) {
    const { commentId } = req.params;
    const userId = req.user.id;
    await commentService.deleteComment(commentId, userId);
    res.status(204).send();
  }

  // 유저 게시글 목록 조회
  async getUserArticles(req, res) {
    const userId = req.user.id;
    const articles = await articleService.getUserArticles(userId);
    res.status(200).json({ articles });
  }
}

export const articleController = new ArticleController();
