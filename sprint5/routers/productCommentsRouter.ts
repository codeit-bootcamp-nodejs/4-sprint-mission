import express from "express";
import {
  validateNewComment,
  validateCommentUpdate,
  validateId,
} from "../middlewares/validate";
import { productCommentsController } from "../controllers/productCommentsController";
import passport from "../lib/passport/index";

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
