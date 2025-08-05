import ArticleService from "../services/ArticleService.js";

const ArticleController = {
  async createArticle(req, res) {
    try {
      const { title, content } = req.body;
      if (!title || !content) {
        return res.status(400).send("제목과 게시글을 입력해주세요.");
      }
      const articleData = { title, content };
      const newArticle = await ArticleService.createArticle(articleData);

      res.status(201).json(newArticle);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "게시글 게시 오류 발생" });
    }
  },

  async findUniqueArticle(req, res) {
    try {
      const { id } = req.params;
      const article = await ArticleService.findUniqueArticle(Number(id));
      res.status(200).json(article);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: `id:${id} , 게시글 조회 실패` });
    }
  },

  async updateArticle(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const article = await ArticleService.updateArticle(
        Number(id),
        updateData
      );
      res.status(201).json(article);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: `id:${id} , 게시글 수정 실패` });
    }
  },

  async deleteArticle(req, res) {
    try {
      const { id } = req.params;
      await ArticleService.deleteArticle(Number(id));
      res.status(201).json({ success: "상품 삭제 성공" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: `id:${id} , 게시글 삭제 실패` });
    }
  },

  async findManyArticle(req, res) {
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
      console.error(err);
      res.status(500).json({ error: `게시글 조회 실패` });
    }
  },
};

export default ArticleController;
