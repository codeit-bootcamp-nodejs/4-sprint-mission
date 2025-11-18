import express from "express";
import passport from "../lib/passport/index";
import { productLike } from "../controllers/productLikeController";
import { authenticateUser } from "../middlewares/validate";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    passport.authenticate("access-token", { session: false }),
    authenticateUser,
    productLike
  );

export default router;
