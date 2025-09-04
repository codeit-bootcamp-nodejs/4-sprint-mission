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

const productCommentRouter = express.Router({ mergeParams: true });

productCommentRouter
  .route("/")
  .get(getProductsComments)
  .post(validateNewComment, postProductComment);

productCommentRouter
  .route("/:commentId")
  .patch(validateCommentUpdate, patchProductComment)
  .delete(validateId, deleteProductComment);

export default productCommentRouter;
