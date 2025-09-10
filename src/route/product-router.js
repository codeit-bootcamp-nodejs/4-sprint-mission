import express from 'express';
import commentRouter from './comment.route.js';

const productRouter = (
  productController,
  commentController, // 댓글 컨트롤러 추가
  validationMiddleware,
) => {
  const router = express.Router();

  router
    .route('/')
    .post(validationMiddleware.validateProduct, productController.createProduct)
    .get(productController.getProducts);

  router
    .route('/:id')
    .get(validationMiddleware.validateId, productController.getProductById)
    .patch(
      [validationMiddleware.validateId, validationMiddleware.validateProduct],
      productController.updateProduct,
    )
    .delete(validationMiddleware.validateId, productController.deleteProduct);

  const commentsRouter = commentRouter(commentController, validationMiddleware);
  router.use('/:productId/comments', commentsRouter);

  return router;
};

export default productRouter;
