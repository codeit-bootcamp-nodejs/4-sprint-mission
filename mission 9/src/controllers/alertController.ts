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
    const alertId = Number(req.params.id);
    await this.service.read(alertId);
    res.status(204).send();
  };
}
