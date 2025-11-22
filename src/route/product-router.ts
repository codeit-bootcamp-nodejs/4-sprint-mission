import express from "express";
import { authMiddleware, authOptionalMiddleware } from "../middleware/index.js";
import { ProductController } from "../controller/product-controller.js";
import { CommentController } from "../controller/comment-controller.js";
import { ValidationMiddleware } from "../middleware/validation-middleware.js";
import commentRouter from "./comment-router.js";

const productRouter = (
  productController: ProductController,
  commentController: CommentController,
  validationMiddleware: ValidationMiddleware
) => {
  const router = express.Router();

  router
    .route("/")
    .post(
      authMiddleware,
      validationMiddleware.validateProduct,
      productController.createProduct
    )
    .get(authOptionalMiddleware, productController.getProducts);

  router
    .route("/:id")
    .get(
      authOptionalMiddleware,
      validationMiddleware.validateId,
      productController.getProductById
    )
    .patch(
      authMiddleware,
      [validationMiddleware.validateId, validationMiddleware.validateProduct],
      productController.updateProduct
    )
    .delete(
      authMiddleware,
      validationMiddleware.validateId,
      productController.deleteProduct
    );

  const commentsRouter = commentRouter(commentController, validationMiddleware);
  router.use("/:productId/comments", commentsRouter);
  router.post("/:id/like", authMiddleware, productController.toggleLike);

  return router;
};

export default productRouter;
