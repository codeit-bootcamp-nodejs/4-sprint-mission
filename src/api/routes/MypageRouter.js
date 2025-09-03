import express from "express";
import authenticate from "../middlewares/authenticate.js";
import MypageController from "../controllers/MypageController.js";
const router = express.Router();

router.get("/:id", authenticate, MypageController.getUser);
router.patch("/:id", authenticate, MypageController.updateUser);
router.patch("/:id/password", authenticate, MypageController.updatePassword);
router.get("/:id/products", authenticate, MypageController.getProducts);

export default router;
