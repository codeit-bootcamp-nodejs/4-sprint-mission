import express from 'express';
import { productController } from '../controllers/productController.js';
import {
  validateId,
  validateCommentId,
  validateProductData,
  validateCommentData,
  validateProductUpdateData,
} from '../middlewares/validation.js';

const router = express.Router();

// 상품
router
  .route('/')
  .get(productController.getAllProducts)
  .post(validateProductData, productController.createProduct);

router
  .route('/:id')
  .get(validateId, productController.getProductById)
  .patch(validateId, validateProductUpdateData, productController.updateProduct)
  .delete(validateId, productController.deleteProduct);

// 댓글
router
  .route('/:id/comments')
  .get(validateId, productController.getComments)
  .post(validateId, validateCommentData, productController.createComment);

router
  .route('/:id/comments/:commentId')
  .get(validateId, validateCommentId, productController.getCommentById)
  .patch(
    validateCommentId,
    validateCommentData,
    productController.updateComment
  )
  .delete(validateCommentId, productController.deleteComment);

export default router;
