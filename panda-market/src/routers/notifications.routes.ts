import express from 'express';
import asyncHandler from '@/middlewares/asyncHandler.js';
import { authentication } from '@/middlewares/authentication.js';
import { validateId } from '@/middlewares/validators/sharedValidator.js';
import { NotificationController } from '@/controllers/notification.controller.js';
import container from '@/lib/inversify.config.js';
import { TYPES } from '@/types/layer.types.js';

const notificationRouter = express.Router();

const notificationController = container.get<NotificationController>(
  TYPES.NotificationController,
);

notificationRouter
  .route('/')
  .get(authentication(), asyncHandler(notificationController.getNotifications));

notificationRouter
  .route('/:id/read')
  .patch(
    authentication(),
    validateId,
    asyncHandler(notificationController.updateNotifications),
  );

notificationRouter
  .route('/unreads/counts')
  .get(
    authentication(),
    asyncHandler(notificationController.getUnreadNotifications),
  );

export default notificationRouter;
