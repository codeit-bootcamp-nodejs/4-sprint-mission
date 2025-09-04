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
    validation.validate(validation.productSchema),
    productController.createProduct
  );

router
  .route('/:id')
  .get(
    validation.validateParam('id', validation.idSchema),
    productController.getProductById
  )
  .patch(
    authenticate,
    isProductOwner,
    validation.validateParam('id', validation.idSchema),
    validation.validate(validation.productUpdateSchema),
    productController.updateProduct
  )
  .delete(
    authenticate,
    isProductOwner,
    validation.validateParam('id', validation.idSchema),
    productController.deleteProduct
  );

// 댓글
router
  .route('/:id/comments')
  .get(
    validation.validateParam('id', validation.idSchema),
    productController.getComments
  )
  .post(
    authenticate,
    validation.validateParam('id', validation.idSchema),
    validation.validate(validation.commentSchema),
    productController.createComment
  );

router
  .route('/:id/comments/:commentId')
  .get(
    validation.validateParam('id', validation.idSchema),
    validation.validateParam('commentId', validation.idSchema),
    productController.getCommentById
  )
  .patch(
    authenticate,
    isCommentOwner,
    validation.validateParam('commentId', validation.idSchema),
    validation.validate(validation.commentSchema),
    productController.updateComment
  )
  .delete(
    authenticate,
    isCommentOwner,
    validation.validateParam('commentId', validation.idSchema),
    productController.deleteComment
  );

export default router;
