const express = require('express');
const articleController = require('./articles.controller');
const { validateArticle } = require('../../middlewares/validation.middleware');

const router = express.Router();

// /api/articles
router.route('/')
  .post(validateArticle, articleController.createArticle)
  .get(articleController.getArticles);

// /api/articles/:id
router.route('/:id')
  .get(articleController.getArticleById)
  .patch(articleController.updateArticle)
  .delete(articleController.deleteArticle);

module.exports = router;
