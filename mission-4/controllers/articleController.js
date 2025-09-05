import {
  getArticleService,
  getArticleListService,
  postArticleService,
  patchArticleService,
  deleteArticleService,
  postArticleLikeService,
  deleteArticleLikeService,
} from "../services/articleService.js";

class ArticleController {
  async getArticle(req, res) {
    const { id } = req.parsedId;
    const args = {
      userId: req.user?.id,
      articleId: id,
    };
    const result = await getArticleService(args);
    return res.status(200).json(result);
  }
  async getArticleList(req, res) {
    const args = {
      userId: req.user?.id,
      ...req.parsedQuery,
    };
    const result = await getArticleListService(args);
    return res.status(200).json(result);
  }
  async postArticle(req, res) {
    const args = {
      userId: req.user.id,
      ...req.body,
    };
    const result = await postArticleService(args);
    return res.status(201).json(result);
  }
  async patchArticle(req, res) {
    const args = {
      id: req.parsedId,
      data: req.body,
    };
    const result = await patchArticleService(args);
    return res.status(200).json(result);
  }
  async deleteArticle(req, res) {
    const result = await deleteArticleService({ id: req.parsedId });
    return res.status(200).json(result);
  }
  async postArticleLike(req, res) {
    const { id } = req.parsedId;
    const args = {
      userId: req.user.id,
      articleId: id,
    };
    const result = await postArticleLikeService(args);
    return res.status(201).json(result);
  }
  async deleteArticleLike(req, res) {
    const { id } = req.parsedId;
    const args = {
      userId: req.user.id,
      articleId: id,
    };
    const result = await deleteArticleLikeService(args);
    return res.status(200).json(result);
  }
}
export default new ArticleController();
