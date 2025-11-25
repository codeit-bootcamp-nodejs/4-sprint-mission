import { AlertRepository } from "../repositories/alertRepository";
import { getIo } from "../socket/io";

export class AlertService {
  private repo = new AlertRepository();

  async create(userId: number, message: string, link?: string) {
    const alert = await this.repo.createAlert({ userId, message, link });

    const io = getIo();
    io.to(`user:${userId}`).emit("newAlert", alert);

    return alert;
  }

  async list(userId: number) {
    return this.repo.findByUserId(userId);
  }

  async read(alertId: number, userId: number) {
    const alert = await this.repo.findById(alertId);

    if (!alert) return false;

    if (alert.userId !== userId) {
      return false;
    }

    await this.repo.markAsRead(alertId);

    return true;
  }

  async countUnread(userId: number) {
    return this.repo.countUnread(userId);
  }
}
