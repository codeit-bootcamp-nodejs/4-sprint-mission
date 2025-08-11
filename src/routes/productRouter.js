import express from 'express';
import productController from '../controllers/productController';
import productValidation from '../middleware/productValidation';

const router = express.Router();

router
  .route('/')
  .post(productValidation, productController.createProduct)
  .get(productController.listProduct);

router
  .route('/:id')
  .get(productController.getProductById)
  .patch(productValidation, productController.updateProduct)
  .delete(productController.deleteProduct);

export default router;
