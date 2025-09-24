import express from "express";
import passport from "../lib/passport/index.js";
import {
  createProductCommentController,
  updateProductCommentController,
  deleteProductCommentController,
  listProductCommentController,
  getProductCommentByIdController,
} from "../controllers/productCommentController.js";
import {
  validateProductCommentBody,
  validateProductCommentParams,
  validateProductCommentQuery,
  validateProductCommentParamsAndQuery,
  validateProductCommentBodyAndParams,
} from "../middlewares/productCommentValidation.js";
import { withTypedHandler } from "../lib/typedRequestHandler.js";
import type {
  ProductCommentBodyDto,
  ProductCommentParamsDto,
  ProductCommentQueryDto,
} from "../dto/request/product-comment.request.dto.js";

const router = express.Router();

//상품
router.get(
  "/products/:productId/comments",
  validateProductCommentParamsAndQuery,
  withTypedHandler<
    ProductCommentParamsDto,
    unknown,
    unknown,
    ProductCommentQueryDto
  >(listProductCommentController)
);

router.get(
  "/products/:productId/comments/:commentId",
  validateProductCommentParams,
  withTypedHandler<ProductCommentParamsDto>(getProductCommentByIdController)
);

router.post(
  "/products/:productId/comments",
  passport.authenticate("access-token", { session: false }),
  validateProductCommentBodyAndParams,
  withTypedHandler<ProductCommentParamsDto, unknown, ProductCommentBodyDto>(
    createProductCommentController
  )
);
router.patch(
  "/products/:productId/comments/:commentId",
  passport.authenticate("access-token", { session: false }),
  validateProductCommentBodyAndParams,
  withTypedHandler<ProductCommentParamsDto, unknown, ProductCommentBodyDto>(
    updateProductCommentController
  )
);
router.delete(
  "/products/:productId/comments/:commentId",
  passport.authenticate("access-token", { session: false }),
  validateProductCommentParams,
  withTypedHandler<ProductCommentParamsDto>(deleteProductCommentController)
);

export default router;
