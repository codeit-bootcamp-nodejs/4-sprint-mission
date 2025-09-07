import express from "express";

import * as Validate from "../middleware/validate.js";
import authenticate from "../middleware/authenticate.js";

import { getProductController } from "../controllers/product/get_product_controller.js";
import { getProductByIdController } from "../controllers/product/get_product_by_id_controller.js";
import { createProductController } from "../controllers/product/create_product_controller.js";
import { updateProductController } from "../controllers/product/update_product_controller.js";
import { deleteProductController } from "../controllers/product/delete_product_controller.js";

import { getProductCommentController } from "../controllers/comment/get_comment_controller.js";
import { createProductCommentController } from "../controllers/comment/create_comment_controller.js";
import { updateCommentController } from "../controllers/comment/update_comment_controller.js";
import { deleteCommentController } from "../controllers/comment/delete_comment_controller.js";

const router = express.Router();

router
  .route("/")
  .get(getProductController)
  .post(authenticate, Validate.validateProduct, createProductController);
router
  .route("/:id")
  .get(getProductByIdController)
  .patch(authenticate, updateProductController)
  .delete(authenticate, deleteProductController);

router
  .route("/:id/comment")
  .get(getProductCommentController)
  .post(authenticate, Validate.validateContent, createProductCommentController);
router
  .route("/:id/comment/:commentId")
  .patch(authenticate, updateCommentController)
  .delete(authenticate, deleteCommentController);

export default router;
