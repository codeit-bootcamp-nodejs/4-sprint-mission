import express from 'express';
import upload from '@lib/multer.js';
import asyncHandler from '@middlewares/asyncHandler.js';
import { validatePostFile } from '@middlewares/validators/fileValidator.js';
import authentication from '@middlewares/authentication.js';
import { validateId } from '@middlewares/validators/sharedValidator.js';
import { fileController } from '@lib/container.js';

const fileRouter = express.Router();

// prettier-ignore
fileRouter.route("/")
    .post(authentication(), upload.single("image"), validatePostFile, asyncHandler(fileController.postFile));

// prettier-ignore
fileRouter.route("/:id")
    .delete(authentication(), validateId, asyncHandler(fileController.deleteFile))

export default fileRouter;
