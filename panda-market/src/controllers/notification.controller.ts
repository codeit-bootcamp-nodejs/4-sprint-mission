import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/layer.types.js';
import { RequestHandler } from 'express';
import { hasId, hasTokenPayload } from '@/types/guard.js';
import { BadRequestError } from '@/lib/errors.js';
import { NotificationService } from '@/services/notification.service.js';

@injectable()
export class NotificationController {
  constructor(
    @inject(TYPES.NotificationService)
    private readonly notificationService: NotificationService,
  ) {}
  getNotifications: RequestHandler = async (req, res) => {
    if (!hasTokenPayload(req)) {
      throw new BadRequestError();
    }
    const { userId: recipientId } = req.tokenPayload;
    const result = await this.notificationService.getNotifications({
      recipientId,
    });
    return res.status(200).json({ data: result });
  };
  getUnreadNotifications: RequestHandler = async (req, res) => {
    if (!hasTokenPayload(req)) {
      throw new BadRequestError();
    }
    const { userId: recipientId } = req.tokenPayload;
    const result = await this.notificationService.getUnreadNotifications({
      recipientId,
    });
    return res.status(200).json({ data: result });
  };
  updateNotifications: RequestHandler = async (req, res) => {
    if (!hasId(req) || !hasTokenPayload(req)) {
      throw new BadRequestError();
    }
    const { id: notificationId } = req.parsedId;
    const { userId: recipientId } = req.tokenPayload;
    const result = await this.notificationService.updateNotifications({
      recipientId,
      notificationId,
    });
    return res.status(200).json({ data: result });
  };
}
