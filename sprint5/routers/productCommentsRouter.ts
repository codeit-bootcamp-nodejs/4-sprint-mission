import express from "express";
import {
  validateNewComment,
  validateCommentUpdate,
  validateId,
} from "../middlewares/validate.js";
import { productCommentsController } from "../controllers/productCommentsController.js";
import passport from "../lib/passport/index.js";

const productCommentRouter = express.Router({ mergeParams: true });

productCommentRouter
  .route("/")
  .get(productCommentsController.getProductsComments)
  .post(
    validateNewComment,
    passport.authenticate("access-token", { session: false }),
    productCommentsController.createProductComment
  );

productCommentRouter
  .route("/:commentId")
  .patch(
    validateCommentUpdate,
    passport.authenticate("access-token", { session: false }),
    productCommentsController.updateProductComment
  )
  .delete(
    validateId,
    passport.authenticate("access-token", { session: false }),
    productCommentsController.deleteProductComment
  );

export default productCommentRouter;
