const express = require('express');
const commentController = require('./comments.controller');
const { validateComment } = require('../../middlewares/validation.middleware');

const router = express.Router();

// --- Product Comments ---
// /api/products/:productId/comments
router.route('/products/:productId/comments')
  .post(validateComment, commentController.createProductComment)
  .get(commentController.getProductComments);

// --- Article Comments ---
// /api/articles/:articleId/comments
router.route('/articles/:articleId/comments')
  .post(validateComment, commentController.createArticleComment)
  .get(commentController.getArticleComments);

// --- General Comment Actions ---
// /api/comments/:commentId
router.route('/comments/:commentId')
  .patch(validateComment, commentController.updateComment)
  .delete(commentController.deleteComment);

module.exports = router;
