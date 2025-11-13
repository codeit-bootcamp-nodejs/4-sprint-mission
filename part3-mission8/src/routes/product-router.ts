import express from 'express';
import { productController } from '../controllers/product-controller.js';
import { validation } from '../middlewares/validation.js';
import { isProductOwner } from '../middlewares/authorize.js';
import { accessAuth } from '../lib/passport/index.js';

const router = express.Router();

// 상품 조회, 등록
router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    accessAuth,
    validation.validate(validation.productSchema),
    productController.createProduct
  );

// 상품 상세 조회, 수정, 삭제
router
  .route('/:id')
  .get(
    validation.validateParam('id', validation.idSchema),
    productController.getProductById
  )
  .patch(
    accessAuth,
    validation.validateParam('id', validation.idSchema),
    isProductOwner,
    validation.validate(validation.productUpdateSchema),
    productController.updateProduct
  )
  .delete(
    accessAuth,
    validation.validateParam('id', validation.idSchema),
    isProductOwner,
    productController.deleteProduct
  );

// 상품 좋아요, 좋아요 취소
router
  .route('/:id/like')
  .post(
    accessAuth,
    validation.validateParam('id', validation.idSchema),
    productController.likeProduct
  )
  .delete(
    accessAuth,
    validation.validateParam('id', validation.idSchema),
    productController.unlikeProduct
  );

router.patch(
  '/:id/price',
  accessAuth,
  validation.validateParam('id', validation.idSchema),
  isProductOwner,
  validation.validate(validation.productPriceUpdateSchema),
  productController.updateProductPrice
);

export default router;
