"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertController = void 0;
const alertService_1 = require("../services/alertService");
const http_status_1 = __importDefault(require("http-status"));
class AlertController {
    constructor() {
        this.service = new alertService_1.AlertService();
        this.list = async (req, res) => {
            if (!req.user)
                return res.status(http_status_1.default.UNAUTHORIZED).json({ message: "Unauthorized" });
            const userId = req.user.id;
            const alerts = await this.service.list(userId);
            res.json(alerts);
        };
        this.markAsRead = async (req, res) => {
            if (!req.user)
                return res.status(http_status_1.default.UNAUTHORIZED).json({ message: "Unauthorized" });
            const userId = req.user.id;
            const alertId = Number(req.params.id);
            if (!alertId) {
                throw new Error("Article not found");
            }
            const success = await this.service.read(alertId, userId);
            if (!success) {
                return res.status(http_status_1.default.FORBIDDEN).json({
                    message: "You do not have permission to read this alert",
                });
            }
            res.status(204).send();
        };
    }
}
exports.AlertController = AlertController;
//# sourceMappingURL=alertController.js.map