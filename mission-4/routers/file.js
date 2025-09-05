import express from "express";
import upload from "../lib/multer.js";
import fileController from "../controllers/fileController.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import fileValidator from "../middlewares/validation.middleware/fileValidator.js";
import authentication from "../middlewares/authentication.js";
import authorization from "../middlewares/authorizaion.js";

const fileRouter = express.Router();

// prettier-ignore
fileRouter.route("/")
    .post(authentication(), upload.single("image"), fileValidator(), asyncHandler(fileController.postFile));

// prettier-ignore
fileRouter.route("/:id")
    .delete(authentication(), fileValidator(), authorization('image'), asyncHandler(fileController.deleteFile))

export default fileRouter;
