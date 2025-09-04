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

router
  .route('/:id/like')
  .post(authenticate, productController.likeProduct)
  .delete(authenticate, productController.unlikeProduct);

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
    (req, res, next) => {
      console.log('ROUTER - req.params:', req.params);
      next();
    },
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

router
  .route('/:id/comments/:commentId/like')
  .post(authenticate, productController.likeComment)
  .delete(authenticate, productController.unlikeComment);

export default router;
