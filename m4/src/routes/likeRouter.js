import { Router } from 'express';
import * as likeController from '../controllers/likeController.js';
import passport from 'passport';

const router = Router();

router.get( '/', likeController.getAllLike);

export default router;