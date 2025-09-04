import express from "express";
import {
  deleteArticleComment,
  getArticleComments,
  patchArticleComment,
  postArticleComment,
} from "../controllers/articleCommentsController.js";
import {
  validateNewComment,
  validateCommentUpdate,
  validateId,
} from "../middlewares/validate.js";

const articleCommentRouter = express.Router({ mergeParams: true });

articleCommentRouter
  .route("/")
  .get(getArticleComments)
  .post(validateNewComment, postArticleComment);

articleCommentRouter
  .route("/:commentId")
  .patch(validateCommentUpdate, patchArticleComment)
  .delete(validateId, deleteArticleComment);

export default articleCommentRouter;
