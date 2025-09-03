import express from "express";
import { upload } from "../lib/multer.js";
import fileController from "../controllers/fileController.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import fileValidator from "../middlewares/validation.middleware/fileValidator.js";

const fileRouter = express.Router();

// prettier-ignore
fileRouter.route("/")
    .post(upload.single("image"), fileValidator(), asyncHandler(fileController.postFile));

// prettier-ignore
fileRouter.route("/:id")
    .delete(fileValidator(), asyncHandler(fileController.deleteFile))

export default fileRouter;
