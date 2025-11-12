import { PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';

const prisma = new PrismaClient();

const getNotification = async(req: Request, res: Response) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user.userId },
  });
  res.status(200).send(notifications);
}

const readNotification = async(req: Request, res: Response) => {
  const notificationId = req.params.notificationId
  const notifications = await prisma.notification.update({
    where: { userId: req.user.userId,
             id : notificationId
     },
    data: {isRead : true}
  });
  res.status(200).send(notifications);
}

const unreadCount = async(req: Request, res: Response) => {
  const unreadCount = await prisma.notification.count({
  where: {
    userId : req.user.userId,
    isRead: false
  }
});
res.status(200).send({ unreadCount });
}

export default { 
  getNotification,
  readNotification,
  unreadCount
};
