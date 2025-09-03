import express from 'express';
import { productController } from '../controllers/product-controller.js';
import { validation } from '../middlewares/validation.js';

const router = express.Router();

// 상품
router
  .route('/')
  .get(productController.getAllProducts)
  .post(validation.validateProductData, productController.createProduct);

router
  .route('/:id')
  .get(validation.validateId, productController.getProductById)
  .patch(
    validation.validateId,
    validation.validateProductUpdateData,
    productController.updateProduct
  )
  .delete(validation.validateId, productController.deleteProduct);

// 댓글
router
  .route('/:id/comments')
  .get(validation.validateId, productController.getComments)
  .post(
    validation.validateId,
    validation.validateCommentData,
    productController.createComment
  );

router
  .route('/:id/comments/:commentId')
  .get(
    validation.validateId,
    validation.validateCommentId,
    productController.getCommentById
  )
  .patch(
    validation.validateCommentId,
    validation.validateCommentData,
    productController.updateComment
  )
  .delete(validation.validateCommentId, productController.deleteComment);

export default router;
