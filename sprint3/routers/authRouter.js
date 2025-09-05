import express from "express";
import passport from "../lib/passport/index.js";
import { login, register } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  login
);

export default router;
