import ArticleService from "../services/ArticleService.js";

const ArticleController = {
  async createArticle(req, res, next) {
    try {
      const { title, content } = req.body;
      if (!title || !content) {
        return res.status(400).send("제목과 게시글을 입력해주세요.");
      }
      const articleData = { title, content };
      const newArticle = await ArticleService.createArticle(articleData);

      res.status(201).json(newArticle);
    } catch (err) {
      next(err);
    }
  },

  async findUniqueArticle(req, res, next) {
    try {
      const { id } = req.params;
      const article = await ArticleService.findUniqueArticle(Number(id));
      res.status(200).json(article);
    } catch (err) {
      next(err);
    }
  },

  async updateArticle(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const article = await ArticleService.updateArticle(
        Number(id),
        updateData
      );
      res.status(201).json(article);
    } catch (err) {
      next(err);
    }
  },

  async deleteArticle(req, res, next) {
    try {
      const { id } = req.params;
      await ArticleService.deleteArticle(Number(id));
      res.status(201).json({ success: "상품 삭제 성공" });
    } catch (err) {
      next(err);
    }
  },

  async findManyArticle(req, res, next) {
    try {
      const { offset = 0, limit = 10, order = "recent", keyword } = req.query;
      const articles = await ArticleService.findManyArticle({
        offset,
        limit,
        order,
        keyword,
      });
      res.status(200).json(articles);
    } catch (err) {
      next(err);
    }
  },
};

export default ArticleController;
