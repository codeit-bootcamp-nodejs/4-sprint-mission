import express from "express";
import passport from "../lib/passport/index.js";
import {
  login,
  logout,
  refresh,
  register,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  login
);
router.post(
  "/refresh",
  passport.authenticate("refresh-token", { session: false }),
  refresh
);
router.post("/logout", logout);

export default router;
