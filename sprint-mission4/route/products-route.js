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
  
//products 수정, 삭제 라우트
router
  .route('/products/:productId')
  .get(ProductService.getProductsById)
  .patch(auth.verifyAccessToken, auth.verifyUserRole, zod.PatchProduct, ProductService.updateProducts)
  .delete(auth.verifyAccessToken, auth.verifyUserRole, ProductService.deleteProducts);

//productComments 등록, 조회 라우트
router
  .route('/products/:productId/productComments')
  .get(ProductService.getProductComments)
  .post(auth.verifyAccessToken, zod.ProductComment, ProductService.createProductComment)

//productComments 수정, 삭제 라우트
router
  .route('/products/:productId/productComments/:productCommentId')
  .patch(zod.PatchProductComment, ProductService.updateProductComment)
  .delete(ProductService.deleteProductComment);


export default router;