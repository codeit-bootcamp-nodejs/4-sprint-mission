import express from 'express';
import ProductService from '../service/products-service.js';
import zod from '../middleware/zod.js';
import auth from '../middleware/auth.js'


const router = express.Router();

//products 등록, 조회 라우트
router
  .route('/products')
  .post(auth.verifyAccessToken, zod.CreateProduct, ProductService.createProducts)
  .get(ProductService.getProducts);

router
  .route('/products/:productId')
  .get(ProductService.getProductsById)
  .patch(zod.PatchProduct, ProductService.updateProducts)
  .delete(ProductService.deleteProducts);


//comments 등록, 조회 라우트
router
  .route('/products/:productId/comments')
  .get(ProductService.getProductComments)
  .post(auth.verifyAccessToken, zod.ProductComment, ProductService.createProductComment)

router
  .route('/products/:productId/comments/:commentId')
  .patch(zod.PatchProductComment, ProductService.updateProductComment)
  .delete(ProductService.deleteProductComment);


export default router;