import express from 'express';
import { deleteComment, patchComment, getCommentList, createComment } from '../services/commentService.js';

const commentRouter = express.Router();

commentRouter.route('/')
    .get(getCommentList())
    .post(createComment())
    
    
commentRouter.route('/:id')
    .patch(patchComment())
    .delete(deleteComment())

export default commentRouter;
