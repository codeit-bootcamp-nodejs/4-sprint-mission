import express from "express";
import passport from "../lib/passport/index.js";
import { articleLike } from "../controllers/articleLikeController.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(passport.authenticate("access-token", { session: false }), articleLike);

export default router;
