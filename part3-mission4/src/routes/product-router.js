import express from 'express';
import { productController } from '../controllers/product-controller.js';
import { validation } from '../middlewares/validation.js';
import authenticate from '../middlewares/authenticate.js';
import { isProductOwner, isCommentOwner } from '../middlewares/authorize.js';

const router = express.Router();

// 상품
router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    authenticate,
    validation.validateProductData,
    productController.createProduct
  );

router
  .route('/:id')
  .get(validation.validateId, productController.getProductById)
  .patch(
    isProductOwner,
    validation.validateId,
    validation.validateProductUpdateData,
    productController.updateProduct
  )
  .delete(
    isProductOwner,
    validation.validateId,
    productController.deleteProduct
  );

// 댓글
router
  .route('/:id/comments')
  .get(validation.validateId, productController.getComments)
  .post(
    authenticate,
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
    isCommentOwner,
    validation.validateCommentId,
    validation.validateCommentData,
    productController.updateComment
  )
  .delete(
    isCommentOwner,
    validation.validateCommentId,
    productController.deleteComment
  );

router.get('/:id/myProducts', authenticate, productController.getUserProducts);

export default router;
