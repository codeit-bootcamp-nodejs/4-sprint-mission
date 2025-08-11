import articleService from '../services/articleService';

const articleController = {
  async createArticle(req, res, next) {
    try {
      const { title, content } = req.body;
      const articleData = { title, content };
      const newArticle = await articleService.createArticle(articleData);
      res.status(201).json(newArticle);
    } catch (error) {
      next(error);
    }
  },

  async getArticleById(req, res, next) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: '유효하지 않은 ID입니다.' });
      }
      const article = await articleService.getArticleById(id);
      res.status(200).json(article);
    } catch (error) {
      next(error);
    }
  },

  async updateArticle(req, res, next) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: '유효하지 않은 ID입니다.' });
      }
      const { title, content } = req.body;
      const articleData = { title, content };
      const articlePatched = await articleService.updateArticle(
        id,
        articleData
      );
      res.status(200).json(articlePatched);
    } catch (error) {
      next(error);
    }
  },

  async deleteArticle(req, res, next) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: '유효하지 않은 ID입니다.' });
      }
      const article = await articleService.deleteArticle(id);
      res.status(200).json(article);
    } catch (error) {
      next(error);
    }
  },

  async listArticle(req, res, next) {
    try {
      const page = Number(req.query.page) || 1;
      const pageSize = Number(req.query.pageSize) || 10;
      const keyword = req.query.keyword?.toString();
      const articles = await articleService.listArticle({
        page,
        pageSize,
        keyword,
      });
      res.status(200).json(articles);
    } catch (error) {
      next(error);
    }
  },
};

export default articleController;
