import express from 'express';
import asyncHandler from '@/middlewares/asyncHandler.js';
import { authentication } from '@/middlewares/authentication.js';
import {
  validatePostBody,
  validatePatchBody,
  validateGetListQuery,
} from '@/middlewares/validators/commentValidator.js';
import { validateId } from '@/middlewares/validators/sharedValidator.js';
import container from '@/lib/inversify.config.js';
import { TYPES } from '@/types/layer.types.js';
import { ProductCommentController } from '@/controllers/product-comments.controller.js';

const productCommentRouter = express.Router();

const productCommentController = container.get<ProductCommentController>(
  TYPES.ProductCommentController,
);

productCommentRouter
  .route('/')
  .get(
    validateGetListQuery,
    asyncHandler(productCommentController.getCommentList),
  )
  .post(
    authentication(),
    validatePostBody,
    asyncHandler(productCommentController.postComment),
  );

productCommentRouter
  .route('/:id')
  .patch(
    authentication(),
    validateId,
    validatePatchBody,
    asyncHandler(productCommentController.patchComment),
  )
  .delete(
    authentication(),
    validateId,
    asyncHandler(productCommentController.deleteComment),
  );

export default productCommentRouter;
