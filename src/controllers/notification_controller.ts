// src/controllers/notification_controller.ts
import { Request, Response } from 'express';
import notificationService from '../services/notification_service';

class NotificationController {
    async getNotifications(req: Request, res: Response) {
        try {
            // 테스트용 하드코딩
            const userId = 1;

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;

            const result = await notificationService.getNotifications(userId, page, limit);

            res.status(200).json(result);
        } catch (error) {
            console.error('알림 조회 실패:', error);
            res.status(500).json({ error: '알림 조회에 실패했습니다.' });
        }
    }

    async getUnreadCount(req: Request, res: Response) {
        try {
            const userId = 1;

            const count = await notificationService.getUnreadCount(userId);

            res.status(200).json({ unreadCount: count });
        } catch (error) {
            console.error('안 읽은 알림 개수 조회 실패:', error);
            res.status(500).json({ error: '안 읽은 알림 개수 조회에 실패했습니다.' });
        }
    }

    async markAsRead(req: Request, res: Response) {
        try {
            const userId = 1;

            const notificationId = parseInt(req.params.id);
            if (isNaN(notificationId)) {
                return res.status(400).json({ error: '유효하지 않은 알림 ID입니다.' });
            }

            const notification = await notificationService.markAsRead(notificationId, userId);

            res.status(200).json(notification);
        } catch (error: any) {
            console.error('알림 읽음 처리 실패:', error);
            if (error.message === '알림을 찾을 수 없습니다.') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: '알림 읽음 처리에 실패했습니다.' });
        }
    }

    async markAllAsRead(req: Request, res: Response) {
        try {
            const userId = 1;

            await notificationService.markAllAsRead(userId);

            res.status(200).json({ message: '모든 알림이 읽음 처리되었습니다.' });
        } catch (error) {
            console.error('모든 알림 읽음 처리 실패:', error);
            res.status(500).json({ error: '모든 알림 읽음 처리에 실패했습니다.' });
        }
    }
}

export default new NotificationController();