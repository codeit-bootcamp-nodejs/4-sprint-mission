import { AlertRepository } from "../repositories/alertRepository";
import { io } from "../app";

export class AlertService {
  private repo = new AlertRepository();

  async create(userId: number, message: string, link?: string) {
    const alert = await this.repo.createAlert({ userId, message, link });

    io.to(`user:${userId}`).emit("newAlert", alert);

    return alert;
  }

  async list(userId: number) {
    return this.repo.findByUserId(userId);
  }

  async read(alertId: number) {
    return this.repo.markAsRead(alertId);
  }

  async countUnread(userId: number) {
    return this.repo.countUnread(userId);
  }
}
