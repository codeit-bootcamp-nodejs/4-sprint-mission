import express from "express";
import * as userController from "../controller/userController.js";
import auth from "../middleware/auth.js";

const userRouter = express.Router();

userRouter
  .route("/users")

  // Create user
  .post(userController.createUser)

  // Get my(user) info
  .get(auth.verifyAccessToken, userController.getMyInfo);

// Update user info (nickname, email)
userRouter.patch(
  "/users/info",
  auth.verifyAccessToken,
  userController.updateMyInfo
);

// Update user password
userRouter.patch(
  "/users/password",
  auth.verifyAccessToken,
  userController.updateMyPassword
);

// Get product lists uploaded by user
userRouter.get(
  "/users/products",
  auth.verifyAccessToken,
  userController.getMyProducts
);

userRouter.post("/login", userController.getAccessToken);
userRouter.post(
  "/login/refresh",
  auth.verifyRefreshToken,
  userController.getRefreshToken
);

export default userRouter;
