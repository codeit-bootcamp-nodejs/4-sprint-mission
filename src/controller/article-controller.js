export class ArticleController {
  constructor(articleService, likeService) {
    this.articleService = articleService;
    this.likeService = likeService;
  }

  // 게시글 생성
  createArticle = async (req, res, next) => {
    try {
      const { id: userId } = req.user;
      const { title, content } = req.body;
      const newArticle = await this.articleService.createArticle(
        userId,
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
      const userId = req.user?.id;
      const result = await this.articleService.getArticles(
        page,
        limit,
        search,
        userId,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  // 게시글 상세 조회
  getArticleById = async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      const result = await this.articleService.getArticleById(id, userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  // 게시글 수정
  updateArticle = async (req, res, next) => {
    try {
      const { id: userId } = req.user;
      const { id } = req.params;
      const articleData = req.body;
      const updatedArticle = await this.articleService.updateArticle(
        userId,
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
      const { id: userId } = req.user;
      const { id } = req.params;
      await this.articleService.deleteArticle(userId, id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  toggleLike = async (req, res, next) => {
    try {
      const { id: userId } = req.user;
      const { id: articleId } = req.params;
      const result = await this.likeService.toggleArticleLike(
        userId,
        parseInt(articleId),
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
