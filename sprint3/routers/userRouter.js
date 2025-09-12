import express from "express";
import passport from "../lib/passport/index.js";
import {
  getLikedProducts,
  getUser,
  getUserProduct,
  patchPassword,
  patchUser,
} from "../controllers/userController.js";

const router = express.Router();

router
  .route("/")
  .get(passport.authenticate("access-token", { session: false }), getUser)
  .patch(passport.authenticate("access-token", { session: false }), patchUser);

router
  .route("/password")
  .patch(
    passport.authenticate("access-token", { session: false }),
    patchPassword
  );

router
  .route("/products")
  .get(
    passport.authenticate("access-token", { session: false }),
    getUserProduct
  );

router
  .route("/like-products")
  .get(
    passport.authenticate("access-token", { session: false }),
    getLikedProducts
  );
export default router;
