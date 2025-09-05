import {
  createArticle,
  getArticles,
  findArticleById,
  updateArticle,
  removeArticle,
} from "../services/articleService.js";

export const getArticleList = async (req, res, next) => {
  try {
    const { offset = 0, limit = 10, title, content } = req.query;

    const articles = await getArticles(offset, limit, title, content);

    if (articles.length === 0) {
      return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
    }

    res.status(200).json(articles);
  } catch (err) {
    next(err);
  }
};

export const postArticle = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    const article = await createArticle(title, content, userId);

    res.status(201).json(article);
  } catch (err) {
    next(err);
  }
};

export const getArticleById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const article = await findArticleById(id);

    if (!article) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    res.status(200).json(article);
  } catch (err) {
    next(err);
  }
};

export const patchArticle = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user.id;

    const { title, content } = req.body;

    const article = await updateArticle(id, title, content, userId);

    res.status(200).json(article);
  } catch (err) {
    next(err);
  }
};

export const deleteArticle = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user.id;

    await removeArticle(id, userId);

    res.status(200).json({ message: `${id} 삭제 완료` });
  } catch (err) {
    next(err);
  }
};
