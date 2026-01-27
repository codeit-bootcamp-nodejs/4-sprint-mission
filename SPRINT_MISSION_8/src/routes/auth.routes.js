import { Router } from "express";
import { register, login, refresh, logout } from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", authRequired, logout);

export default router;
