import express from "express";
import passport from "../lib/passport/index";
import { articleLike } from "../controllers/articleLikeController";
import { authenticateUser } from "../middlewares/validate";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    passport.authenticate("access-token", { session: false }),
    authenticateUser,
    articleLike
  );

export default router;
