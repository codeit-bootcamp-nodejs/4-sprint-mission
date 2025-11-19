import { Request, Response } from 'express';
import { NotificationsService } from './notifications.service';

export class NotificationsController {
  constructor(private service: NotificationsService) {}

  // Test endpoint to create notification manually
  createTestNotification = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, type, title, message } = req.body;

      const notification = await this.service.createNotification({
        user_id: userId,
        type,
        title,
        message
      });

      res.json({ success: true, notification });
    } catch (error: any) {
      console.error('POST /api/test-notification error:', error);
      res.status(500).json({ error: error.message });
    }
  };
}
