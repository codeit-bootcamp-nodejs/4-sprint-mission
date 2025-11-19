import pool from '../../shared/database/pool';
import { NotificationsRepository } from './notifications.repository';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsSocket } from './notifications.socket';

// Initialize Notifications feature
const notificationsRepository = new NotificationsRepository(pool);
export const notificationsService = new NotificationsService(notificationsRepository);
export const notificationsController = new NotificationsController(notificationsService);

export * from './notifications.types';
export { NotificationsRepository, NotificationsService, NotificationsController, NotificationsSocket };
