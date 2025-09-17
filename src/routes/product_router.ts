import express from "express";

import * as Validate from "../middleware/validate";
import authenticate from "../middleware/authenticate";

import {
  getProductController,
  getProductByIdController,
  createProductController,
  updateProductController,
  deleteProductController,
} from "../controllers/product_controller";

import {
  getProductCommentController,
  createProductCommentController,
  updateCommentController,
  deleteCommentController,
} from "../controllers/comment_controller";

import { ProductLikeController } from "../controllers/like_controller";

const router = express.Router();

router
  .route("/")
  .get(authenticate, getProductController)
  .post(authenticate, Validate.validateProduct, createProductController);
router
  .route("/:id")
  .get(authenticate, getProductByIdController)
  .patch(authenticate, updateProductController)
  .delete(authenticate, deleteProductController);

router.post("/:id/like", authenticate, ProductLikeController);

router
  .route("/:id/comment")
  .get(getProductCommentController)
  .post(authenticate, Validate.validateContent, createProductCommentController);
router
  .route("/:id/comment/:commentId")
  .patch(authenticate, updateCommentController)
  .delete(authenticate, deleteCommentController);

export default router;
