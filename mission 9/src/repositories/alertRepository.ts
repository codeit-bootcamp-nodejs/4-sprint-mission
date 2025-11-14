import prisma from "../lib/prisma";

export class AlertRepository {
  async createAlert(data: { userId: number; message: string; link?: string }) {
    return prisma.alert.create({ data });
  }

  async findByUserId(userId: number) {
    return prisma.alert.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async markAsRead(id: number) {
    return prisma.alert.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async countUnread(userId: number) {
    return prisma.alert.count({
      where: { userId, isRead: false },
    });
  }

  async findById(id: number) {
    return prisma.alert.findUnique({
      where: { id },
    });
  }
}
