// src/routes/product.routes.js

import express from 'express';
import * as productController from '../controllers/product.controller.js';
import {
  validateProduct,
  validateProductPatch,
} from '../middlewares/validation.js';
import { authenticateToken, optionalAuth } from '../middlewares/auth.js';

const router = express.Router();

router
  .route('/')
  .post(authenticateToken, validateProduct, productController.createProduct)
  .get(optionalAuth, productController.getAllProducts);

router
  .route('/:id')
  .get(optionalAuth, productController.getProductById)
  .patch(authenticateToken, validateProductPatch, productController.updateProduct)
  .delete(authenticateToken, productController.deleteProduct);

router.post('/:id/like', authenticateToken, productController.toggleProductLike);
export default router;
