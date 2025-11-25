"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertService = void 0;
const alertRepository_1 = require("../repositories/alertRepository");
const io_1 = require("../socket/io");
class AlertService {
    constructor() {
        this.repo = new alertRepository_1.AlertRepository();
    }
    async create(userId, message, link) {
        const alert = await this.repo.createAlert({ userId, message, link });
        const io = (0, io_1.getIo)();
        io.to(`user:${userId}`).emit("newAlert", alert);
        return alert;
    }
    async list(userId) {
        return this.repo.findByUserId(userId);
    }
    async read(alertId, userId) {
        const alert = await this.repo.findById(alertId);
        if (!alert)
            return false;
        if (alert.userId !== userId) {
            return false;
        }
        await this.repo.markAsRead(alertId);
        return true;
    }
    async countUnread(userId) {
        return this.repo.countUnread(userId);
    }
}
exports.AlertService = AlertService;
//# sourceMappingURL=alertService.js.map