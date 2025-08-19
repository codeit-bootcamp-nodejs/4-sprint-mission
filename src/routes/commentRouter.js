import express from 'express';
import commentController from '../controllers/commentController';
import commentValidation from '../middleware/commentValidation';

const router = express.Router();

router
  .route('/products/:id/comments')
  .post(commentValidation, commentController.createProductComment)
  .get(commentController.listProductComment);

router
  .route('/products/:id/comments/:commentId')
  .patch(commentValidation, commentController.updateProductComment)
  .delete(commentController.deleteProductComment);

router
  .route('/articles/:id/comments')
  .post(commentValidation, commentController.createArticleComment)
  .get(commentController.listArticleComment);

router
  .route('/articles/:id/comments/:commentId')
  .patch(commentValidation, commentController.updateArticleComment)
  .delete(commentController.deleteArticleComment);

export default router;
