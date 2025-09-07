import express from "express";
import passport from "../lib/passport/index.js";
import {
  getProfile,
  updateProfile,
  changePassword,
  deleteUser,
  getProducts,
  getLikedProductsHandler,
  getLikedArticlesHandler,
} from "../controllers/userController.js";
import {
  validateUpdateProfile,
  validateChangePassword,
} from "../middleware/userValidation.js";

const router = express.Router();

router.get(
  "/profile",
  passport.authenticate("access-token", { session: false }),
  getProfile
);

router.put(
  "/profile",
  passport.authenticate("access-token", { session: false }),
  validateUpdateProfile,
  updateProfile
);

router.put(
  "/password",
  passport.authenticate("access-token", { session: false }),
  validateChangePassword,
  changePassword
);

router.delete(
  "/delete",
  passport.authenticate("access-token", { session: false }),
  deleteUser
);

// 유저가 등록한 상품 조회
router.get(
  "/products",
  passport.authenticate("access-token", { session: false }),
  getProducts
);

// 유저가 좋아요한 상품 목록
router.get(
  "/likes/products",
  passport.authenticate("access-token", { session: false }),
  getLikedProductsHandler
);

// 유저가 좋아요한 게시글 목록
router.get(
  "/likes/articles",
  passport.authenticate("access-token", { session: false }),
  getLikedArticlesHandler
);

export default router;
