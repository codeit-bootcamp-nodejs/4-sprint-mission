import express from 'express';
import ProductService from '../service/products-service.js';
import zod from '../middleware/zod.js';


const router = express.Router();

router
  .route('/products')
  .post(zod.CreateProduct, ProductService.createProducts)
  .get(ProductService.getProducts);

router
  .route('/products/:productId')
  .get(ProductService.getProductsById)
  .patch(zod.PatchProduct, ProductService.updateProducts)
  .delete(ProductService.deleteProducts);

router
  .route('/products/:productId/comments')
  .get(ProductService.getProductComments)
  .post(zod.ProductComment, ProductService.createProductComment)

router
  .route('/products/:productId/comments/:commentId')
  .patch(zod.PatchProductComment, ProductService.updateProductComment)
  .delete(ProductService.deleteProductComment);


export default router;