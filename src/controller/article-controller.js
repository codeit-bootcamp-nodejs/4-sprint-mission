export class ArticleController {
  constructor(articleService) {
    this.articleService = articleService;
  }

  // 게시글 생성
  createArticle = async (req, res, next) => {
    try {
      const { title, content } = req.body;
      const newArticle = await this.articleService.createArticle(
        title,
        content,
      );
      res.status(201).json(newArticle);
    } catch (error) {
      next(error);
    }
  };

  // 게시글 목록 조회
  getArticles = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page || '1');
      const limit = parseInt(req.query.limit || '10');
      const search = req.query.search;

      const articles = await this.articleService.getArticles(
        page,
        limit,
        search,
      );
      res.status(200).json(articles);
    } catch (error) {
      next(error);
    }
  };

  // 게시글 상세 조회
  getArticleById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const article = await this.articleService.getArticleById(id);
      res.status(200).json(article);
    } catch (error) {
      next(error);
    }
  };

  // 게시글 수정
  updateArticle = async (req, res, next) => {
    try {
      const { id } = req.params;
      const articleData = req.body;
      const updatedArticle = await this.articleService.updateArticle(
        id,
        articleData,
      );
      res.status(200).json(updatedArticle);
    } catch (error) {
      next(error);
    }
  };

  // 게시글 삭제
  deleteArticle = async (req, res, next) => {
    try {
      const { id } = req.params;
      await this.articleService.deleteArticle(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
