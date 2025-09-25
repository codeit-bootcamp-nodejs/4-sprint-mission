import express from "express";
import {
  validateNewComment,
  validateCommentUpdate,
  validateId,
} from "../middlewares/validate.js";
import {
  deleteProductComment,
  getProductsComments,
  patchProductComment,
  postProductComment,
} from "../controllers/productCommentsController.js";
import passport from "../lib/passport/index.js";

const productCommentRouter = express.Router({ mergeParams: true });

productCommentRouter
  .route("/")
  .get(getProductsComments)
  .post(
    validateNewComment,
    passport.authenticate("access-token", { session: false }),
    postProductComment
  );

productCommentRouter
  .route("/:commentId")
  .patch(
    validateCommentUpdate,
    passport.authenticate("access-token", { session: false }),
    patchProductComment
  )
  .delete(
    validateId,
    passport.authenticate("access-token", { session: false }),
    deleteProductComment
  );

export default productCommentRouter;
