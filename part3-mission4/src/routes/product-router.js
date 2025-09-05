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
    validation.validateParam('id', validation.idSchema),
    isProductOwner,
    validation.validate(validation.productUpdateSchema),
    productController.updateProduct
  )
  .delete(
    authenticate,
    validation.validateParam('id', validation.idSchema),
    isProductOwner,
    productController.deleteProduct
  );

router
  .route('/:id/like')
  .post(
    authenticate,
    validation.validateParam('id', validation.idSchema),
    productController.likeProduct
  )
  .delete(
    authenticate,
    validation.validateParam('id', validation.idSchema),
    productController.unlikeProduct
  );

export default router;
