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
} from "../middleware/productCommentValidation.js";

const router = express.Router();

//상품
router.get(
  "/products/:productId/comments",
  validateProductCommentParams,
  validateProductCommentQuery,
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
  validateProductCommentParams,
  validateProductCommentBody,
  createProductCommentController
);
router.patch(
  "/products/:productId/comments/:commentId",
  passport.authenticate("access-token", { session: false }),
  validateProductCommentParams,
  validateProductCommentBody,
  updateProductCommentController
);
router.delete(
  "/products/:productId/comments/:commentId",
  passport.authenticate("access-token", { session: false }),
  validateProductCommentParams,
  deleteProductCommentController
);

export default router;
