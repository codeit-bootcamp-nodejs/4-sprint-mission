import express from 'express';
import { withAsync } from '../lib/withAsync';
import authenticate from '../middlewares/authenticate';
import {
  createComment,
  updateComment,
  deleteComment,
} from '../controllers/commentsController';

const commentsRouter = express.Router();

commentsRouter.post('/', authenticate(), withAsync(createComment));
commentsRouter.patch('/:id', authenticate(), withAsync(updateComment));
commentsRouter.delete('/:id', authenticate(), withAsync(deleteComment));

export default commentsRouter;
