const express = require('express');
const productsRouter = require('./products/products.router');
const articlesRouter = require('./articles/articles.router');
const commentsRouter = require('./comments/comments.router');

const router = express.Router();

router.use('/products', productsRouter);
router.use('/articles', articlesRouter);
router.use('/', commentsRouter); // /products/:productId/comments, /articles/:articleId/comments

module.exports = router;
