import express from "express";
import passport from "../lib/passport/index.js";
import {
  getProfileController,
  updateProfileController,
  changePasswordController,
  deleteUserController,
  getProductsController,
  getLikedProductsController,
  getLikedArticlesController,
} from "../controllers/userController.js";
import {
  validateUpdateProfileBody,
  validateChangePasswordBody,
} from "../middlewares/userValidation.js";
import { queryGuard } from "../middlewares/queryGuard.js";

const router = express.Router();

router.get(
  "/profile",
  queryGuard,
  passport.authenticate("access-token", { session: false }),
  getProfileController
);

router.put(
  "/profile",
  passport.authenticate("access-token", { session: false }),
  validateUpdateProfileBody,
  updateProfileController
);

router.put(
  "/password",
  passport.authenticate("access-token", { session: false }),
  validateChangePasswordBody,
  changePasswordController
);

router.delete(
  "/delete",
  queryGuard,
  passport.authenticate("access-token", { session: false }),
  deleteUserController
);

// 유저가 등록한 상품 조회
router.get(
  "/products",
  queryGuard,
  passport.authenticate("access-token", { session: false }),
  getProductsController
);

// 유저가 좋아요한 상품 목록
router.get(
  "/likes/products",
  queryGuard,
  passport.authenticate("access-token", { session: false }),
  getLikedProductsController
);

// 유저가 좋아요한 게시글 목록
router.get(
  "/likes/articles",
  queryGuard,
  passport.authenticate("access-token", { session: false }),
  getLikedArticlesController
);

export default router;
