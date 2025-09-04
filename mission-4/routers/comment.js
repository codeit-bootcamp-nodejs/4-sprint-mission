import express from "express";
import commentValidator from "../middlewares/validation.middleware/commentValidator.js";
import CommentController from "../controllers/commentController.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import authentication from "../middlewares/authentication.js";
import authorization from "../middlewares/authorizaion.js";

const commentRouter = express.Router();

// prettier-ignore
commentRouter.route('/')
    .get(commentValidator(), asyncHandler(CommentController.getCommentList))
    .post(authentication(), commentValidator(), asyncHandler(CommentController.postComment))

// prettier-ignore
commentRouter.route('/:id')
    .patch(authentication(), commentValidator(), authorization('comment'), asyncHandler(CommentController.patchComment))
    .delete(authentication(), commentValidator(), authorization('comment'), asyncHandler(CommentController.deleteComment))

export default commentRouter;
