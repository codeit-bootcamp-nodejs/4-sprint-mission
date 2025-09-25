import express from "express";
import passport from "../lib/passport/index.js";
import { productLike } from "../controllers/productLikeController.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(passport.authenticate("access-token", { session: false }), productLike);

export default router;
