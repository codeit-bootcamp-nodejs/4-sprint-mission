import { Request, Response } from "express";
import { AlertService } from "../services/alertService";
import status from "http-status";

export class AlertController {
  private service = new AlertService();

  list = async (req: Request, res: Response) => {
    if (!req.user)
      return res.status(status.UNAUTHORIZED).json({ message: "Unauthorized" });
    const userId = req.user.id;
    const alerts = await this.service.list(userId);
    res.json(alerts);
  };

  markAsRead = async (req: Request, res: Response) => {
    if (!req.user)
      return res.status(status.UNAUTHORIZED).json({ message: "Unauthorized" });

    const userId = req.user.id;
    const alertId = Number(req.params.id);

    if (!alertId) {
      throw new Error("Article not found");
    }

    const success = await this.service.read(alertId, userId);

    if (!success) {
      return res.status(status.FORBIDDEN).json({
        message: "You do not have permission to read this alert",
      });
    }
    res.status(204).send();
  };
}
