import express from 'express';
import commentRouter from './comment.js';
import parentIdParser from '../middlewares/parnetIdParser.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import ProductController from '../controllers/productController.js';
import { validatePatchBody, validatePostBody } from '../middlewares/validators/productValidator.js';
import { validateId, validateGetListQuery } from '../middlewares/validators/sharedValidator.js';
import authentication from '../middlewares/authentication.js';
import authorization from '../middlewares/authorization.js';
import optionalAuthentication from '../middlewares/optionalAuthentication.js';

const productRouter = express.Router();

productRouter.use('/:id/comment', parentIdParser, commentRouter);

// prettier-ignore
productRouter.route("/")
  .get(optionalAuthentication(), validateGetListQuery, asyncHandler(ProductController.getProductList))
  .post(authentication(), validatePostBody, asyncHandler(ProductController.postProduct));

// prettier-ignore
productRouter.route("/:id")
  .get(optionalAuthentication(), validateId, asyncHandler(ProductController.getProduct))
  .patch(authentication(), validateId, validatePatchBody, authorization('product'), asyncHandler(ProductController.patchProduct))
  .delete(authentication(), validateId, authorization('product'), asyncHandler(ProductController.deleteProduct));

// prettier-ignore
productRouter.route("/:id/likes")
  .post(authentication(), validateId, asyncHandler(ProductController.postProductLike))
  .delete(authentication(), validateId, asyncHandler(ProductController.deleteProductLike))

export default productRouter;
