import express from "express";
import passport from "../lib/passport/index.js";
import {
  getLikedProducts,
  getUser,
  getUserProduct,
  patchPassword,
  patchUser,
} from "../controllers/userController.js";
import { authenticateUser } from "../middlewares/validate.js";

const router = express.Router();

router
  .route("/")
  .get(
    passport.authenticate("access-token", { session: false }),
    authenticateUser,
    getUser
  )
  .patch(
    passport.authenticate("access-token", { session: false }),
    authenticateUser,
    patchUser
  );

router
  .route("/password")
  .patch(
    passport.authenticate("access-token", { session: false }),
    authenticateUser,
    patchPassword
  );

router
  .route("/products")
  .get(
    passport.authenticate("access-token", { session: false }),
    authenticateUser,
    getUserProduct
  );

router
  .route("/like-products")
  .get(
    passport.authenticate("access-token", { session: false }),
    authenticateUser,
    getLikedProducts
  );

export default router;
