import express from "express";
import type { Router } from "express";
import { validateProduct } from "../middleware/validator.js";
import auth from "../middleware/auth.js";
import * as productController from "../controller/productController.js";

const router = express.Router();

router
  .route("/")

  // Upload a new product
  .post(
    auth.verifyAccessToken,
    validateProduct,
    productController.createProduct
  )

  // Retrieve all products
  .get(productController.getProducts);

router
  .route("/:id")

  // Get informations of a specific product
  .get(productController.getProduct)

  // Modify a product property
  .patch(
    auth.verifyAccessToken,
    auth.verifyProductAuth,
    productController.patchProduct
  )

  // Delete a particular product
  .delete(
    auth.verifyAccessToken,
    auth.verifyProductAuth,
    productController.deleteProduct
  );

router
  .route("/:id/comments")

  // Add a comment
  .post(
    auth.verifyAccessToken,
    auth.checkProductExist,
    productController.postComment
  )

  // Inquery all comments
  .get(auth.checkProductExist, productController.getComments);

router
  .route("/:id/comments/:cid")

  .patch(
    auth.verifyAccessToken,
    auth.checkProductExist,
    auth.verifyProductCommentAuth,
    productController.patchComment
  )

  .delete(
    auth.verifyAccessToken,
    auth.checkProductExist,
    auth.verifyProductCommentAuth,
    productController.deleteComment
  );

export default router;
