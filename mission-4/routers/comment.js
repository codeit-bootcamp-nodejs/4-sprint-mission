import express from "express";
import commnetValidator from "../middlewares/commentValidator.js";
import CommentController from "../controllers/commentController.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const commentRouter = express.Router();

// prettier-ignore
commentRouter.route('/')
    .get(commnetValidator(), asyncHandler(CommentController.getCommentList))
    .post(commnetValidator(), asyncHandler(CommentController.postComment))

// prettier-ignore
commentRouter.route('/:id')
    .patch(commnetValidator(), asyncHandler(CommentController.patchComment))
    .delete(commnetValidator(), asyncHandler(CommentController.deleteComment))

export default commentRouter;
