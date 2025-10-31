import express from 'express';
import commentRouter from './comment.js';
import parentIdParser from '@/middlewares/parnetIdParser.js';
import asyncHandler from '@/middlewares/asyncHandler.js';
import {
  validatePatchBody,
  validatePostBody,
} from '@/middlewares/validators/productValidator.js';
import {
  validateId,
  validateGetListQuery,
} from '@/middlewares/validators/sharedValidator.js';
import authentication from '@/middlewares/authentication.js';
import optionalAuthentication from '@/middlewares/optionalAuthentication.js';
import container from '@/lib/inversify.config.js';
import type { ProductController } from '@/controllers/productController.js';
import { TYPES } from '@/types/layer.types.js';

const productRouter = express.Router();

const productController = container.get<ProductController>(
  TYPES.ProductController,
);

productRouter.use('/:id/comment', parentIdParser, commentRouter);

// prettier-ignore
productRouter.route("/")
  .get(optionalAuthentication(), validateGetListQuery, asyncHandler(productController.getProductList))
  .post(authentication(), validatePostBody, asyncHandler(productController.postProduct));

// prettier-ignore
productRouter.route("/:id")
  .get(optionalAuthentication(), validateId, asyncHandler(productController.getProduct))
  .patch(authentication(), validateId, validatePatchBody, asyncHandler(productController.patchProduct))
  .delete(authentication(), validateId, asyncHandler(productController.deleteProduct));

// prettier-ignore
productRouter.route("/:id/likes")
  .post(authentication(), validateId, asyncHandler(productController.postProductLike))
  .delete(authentication(), validateId, asyncHandler(productController.deleteProductLike))

export default productRouter;
