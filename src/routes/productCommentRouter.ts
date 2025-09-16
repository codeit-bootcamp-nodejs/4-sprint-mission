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

const router = express.Router();

//상품
router.get(
  "/products/:productId/comments",
  validateProductCommentParamsAndQuery,
  listProductCommentController
);

router.get(
  "/products/:productId/comments/:commentId",
  validateProductCommentParams,
  getProductCommentByIdController
);

router.post(
  "/products/:productId/comments",
  passport.authenticate("access-token", { session: false }),
  validateProductCommentBodyAndParams,
  createProductCommentController
);
router.patch(
  "/products/:productId/comments/:commentId",
  passport.authenticate("access-token", { session: false }),
  validateProductCommentBodyAndParams,
  updateProductCommentController
);
router.delete(
  "/products/:productId/comments/:commentId",
  passport.authenticate("access-token", { session: false }),
  validateProductCommentParams,
  deleteProductCommentController
);

export default router;
