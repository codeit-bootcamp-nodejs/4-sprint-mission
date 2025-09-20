import express from 'express';
import { authMiddleware, authOptionalMiddleware } from '../middleware';
import { ProductController } from '../controller/product-controller';
import { CommentController } from '../controller/comment-controller';
import { ValidationMiddleware } from '../middleware/validation-middleware';
import commentRouter from './comment-router';

const productRouter = (
  productController: ProductController,
  commentController: CommentController,
  validationMiddleware: ValidationMiddleware,
) => {
  const router = express.Router();

  router
    .route('/')
    .post(
      authMiddleware,
      validationMiddleware.validateProduct,
      productController.createProduct,
    )
    .get(authOptionalMiddleware, productController.getProducts);

  router
    .route('/:id')
    .get(
      authOptionalMiddleware,
      validationMiddleware.validateId,
      productController.getProductById,
    )
    .patch(
      authMiddleware,
      [validationMiddleware.validateId, validationMiddleware.validateProduct],
      productController.updateProduct,
    )
    .delete(
      authMiddleware,
      validationMiddleware.validateId,
      productController.deleteProduct,
    );

  const commentsRouter = commentRouter(commentController, validationMiddleware);
  router.use('/:productId/comments', commentsRouter);
  router.post('/:id/like', authMiddleware, productController.toggleLike);

  return router;
};

export default productRouter;