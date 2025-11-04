import { Router } from "express";
import { notificationController } from "../controllers/notification-controller";
import auth from "../middlewares/authenticate"; 

const router = Router();


router.get("/", auth(), notificationController.list);
router.get("/unread-count", auth(), notificationController.unreadCount);
router.patch("/:id/read", auth(), notificationController.markRead);

export default router;
