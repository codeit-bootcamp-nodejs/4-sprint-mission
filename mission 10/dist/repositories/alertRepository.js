"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertRepository = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
class AlertRepository {
    async createAlert(data) {
        return prisma_1.default.alert.create({ data });
    }
    async findByUserId(userId) {
        return prisma_1.default.alert.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
    }
    async markAsRead(id) {
        return prisma_1.default.alert.update({
            where: { id },
            data: { isRead: true },
        });
    }
    async countUnread(userId) {
        return prisma_1.default.alert.count({
            where: { userId, isRead: false },
        });
    }
    async findById(id) {
        return prisma_1.default.alert.findUnique({
            where: { id },
        });
    }
}
exports.AlertRepository = AlertRepository;
//# sourceMappingURL=alertRepository.js.map