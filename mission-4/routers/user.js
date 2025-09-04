import express from "express";
import asyncHandler from "../middlewares/asyncHandler.js";
import UserController from "../controllers/userController.js";
import userValidator from "../middlewares/validation.middleware/userValidator.js";
import authentication from "../middlewares/authentication.js";
import validatePasswordChange from "../middlewares/validatePasswordChange.js";

const userRouter = express.Router();

// prettier-ignore
userRouter.route("/")
  .get(authentication(), asyncHandler(UserController.getUser))
  .patch(authentication(), userValidator(), validatePasswordChange(), asyncHandler(UserController.patchUser))
  .delete(authentication(), asyncHandler(UserController.deleteUser));

// prettier-ignore
userRouter.route("/:content")
  .get(authentication(), userValidator(), asyncHandler(UserController.getUserContentList))

export default userRouter;
