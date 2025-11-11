import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/layer.types.js';
import {
  CreateDTO,
  CreateManyDTO,
  RecipientId,
  UpdateReadParams,
} from '@/dto/notifications.dto.js';

@injectable()
export class NotificationRepository {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient,
  ) {}
  async create({ tx, createData: data }: CreateDTO) {
    const db = tx || this.prisma;
    return await db.notification.create({
      data,
    });
  }
  async createMany({ tx, createData: data }: CreateManyDTO) {
    const db = tx || this.prisma;
    return await db.notification.createMany({
      data,
    });
  }
  async findManyUserId({ recipientId }: RecipientId) {
    return await this.prisma.notification.findMany({
      where: { recipientId },
    });
  }
  async countUnread({ recipientId }: RecipientId) {
    return await this.prisma.notification.count({
      where: { AND: [{ recipientId }, { isRead: false }] },
    });
  }
  async updateRead({ recipientId, notificationId }: UpdateReadParams) {
    return await this.prisma.notification.update({
      where: {
        id: notificationId,
        recipientId,
      },
      data: {
        isRead: true,
      },
    });
  }
}
