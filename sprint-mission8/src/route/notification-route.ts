import express from 'express';
import notificationService from '../service/notification-service.js';
import auth from '../middleware/auth.js'
import zod from '../middleware/zod.js';

const router = express.Router();

router
  .route('/notification')
  .get(auth.verifyAccessToken, notificationService.getNotification)
  .get(auth.verifyAccessToken, notificationService.unreadCount);

router
  .route('/notification/:notificationId')
  .patch(auth.verifyAccessToken, notificationService.readNotification);

export default router;