import express from 'express';
import upload from '@/lib/multer.js';
import asyncHandler from '@/middlewares/asyncHandler.js';
import { validatePostFile } from '@/middlewares/validators/fileValidator.js';
import authentication from '@/middlewares/authentication.js';
import { validateId } from '@/middlewares/validators/sharedValidator.js';
import container from '@/lib/inversify.config.js';
import type { FileController } from '@/controllers/fileController.js';
import { TYPES } from '@/types/layer.types.js';

const fileRouter = express.Router();

const fileController = container.get<FileController>(TYPES.FileController);

// prettier-ignore
fileRouter.route("/")
    .post(authentication(), upload.single("image"), validatePostFile, asyncHandler(fileController.postFile));

// prettier-ignore
fileRouter.route("/:id")
    .delete(authentication(), validateId, asyncHandler(fileController.deleteFile))

export default fileRouter;
