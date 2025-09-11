import express from 'express';
import commentRouter from './comment.route.js';
import { authMiddleware } from '../middleware/auth-middleware.js';
import { authOptionalMiddleware } from '../middleware/auth-optional-middleware.js';

const productRouter = (
  productController,
  commentController, // 댓글 컨트롤러 추가
  validationMiddleware,
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
