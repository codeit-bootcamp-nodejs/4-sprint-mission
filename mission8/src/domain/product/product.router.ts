import express from 'express';

import { authMiddleware } from '../../middleware/auth.middleware.js';
import { validateMiddleware } from '../../middleware/validate.middleware.js';
import { productController } from './product.controller.js';
import { productSchema } from './product.schema.js';

export const productRouter = express.Router();

productRouter.patch(
  '/:productId/price',
  authMiddleware,
  validateMiddleware(productSchema.updatePrice),
  productController.updatePrice,
); // 가격 변경
