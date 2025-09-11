import {
  getArticleService,
  getArticleListService,
  postArticleService,
  patchArticleService,
  deleteArticleService,
  postArticleLikeService,
  deleteArticleLikeService,
} from '../services/articleService.js';

class ArticleController {
  async getArticle(req, res) {
    const { id: articleId } = req.parsedId;
    const { id: userId } = req.tokenPayload || {};
    const result = await getArticleService({ userId, articleId });
    return res.status(200).json(result);
  }
  async getArticleList(req, res) {
    const { id: userId } = req.tokenPayload || {};
    const result = await getArticleListService({ userId, ...req.parsedQuery });
    return res.status(200).json(result);
  }
  async postArticle(req, res) {
    const { id: userId } = req.tokenPayload;
    const result = await postArticleService({ userId, ...req.body });
    return res.status(201).json(result);
  }
  async patchArticle(req, res) {
    const id = req.parsedId;
    const data = req.body;
    const result = await patchArticleService({ id, data });
    return res.status(200).json(result);
  }
  async deleteArticle(req, res) {
    const result = await deleteArticleService({ id: req.parsedId });
    return res.status(200).json(result);
  }
  async postArticleLike(req, res) {
    const { id: articleId } = req.parsedId;
    const { id: userId } = req.tokenPayload;
    const result = await postArticleLikeService({ userId, articleId });
    return res.status(201).json(result);
  }
  async deleteArticleLike(req, res) {
    const { id: articleId } = req.parsedId;
    const { id: userId } = req.tokenPayload;
    const result = await deleteArticleLikeService({ userId, articleId });
    return res.status(200).json(result);
  }
}
export default new ArticleController();
