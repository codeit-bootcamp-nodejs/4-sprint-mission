import { Router } from 'express';
import { withAsync } from '../lib/withAsync';
import { createComment } from './commentController'; // Note: Typo in the original filename
import authenticate from '../middlewares/authenticate';

const commentRoutes = Router();

// 새 댓글 생성
commentRoutes.post('/', authenticate(), withAsync(createComment));

export default commentRoutes;
