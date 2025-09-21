import express from "express";
import passport from "../lib/passport/index.js";
import { userController } from "../controllers/userController.js";
import { authenticateUser } from "../middlewares/validate.js";

const router = express.Router();

router
  .route("/")
  .get(
    passport.authenticate("access-token", { session: false }),
    authenticateUser,
    userController.getUser
  )
  .patch(
    passport.authenticate("access-token", { session: false }),
    authenticateUser,
    userController.patchUser
  );

router
  .route("/password")
  .patch(
    passport.authenticate("access-token", { session: false }),
    authenticateUser,
    userController.patchPassword
  );

router
  .route("/products")
  .get(
    passport.authenticate("access-token", { session: false }),
    authenticateUser,
    userController.getUserProduct
  );

router
  .route("/like-products")
  .get(
    passport.authenticate("access-token", { session: false }),
    authenticateUser,
    userController.getLikedProducts
  );

export default router;
