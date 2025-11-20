import express from 'express';
import { withAsync } from '../lib/withAsync';
import authenticate from '../middlewares/authenticate';
import { readNotification } from '../controllers/notificationsController';

const notificationsRouter = express.Router();

notificationsRouter.patch('/:id/read', authenticate(), withAsync(readNotification));

export default notificationsRouter;
