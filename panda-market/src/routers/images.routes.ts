import express from 'express';
import upload from '@/lib/multer.js';
import asyncHandler from '@/middlewares/asyncHandler.js';
import { authentication } from '@/middlewares/authentication.js';
import container from '@/lib/inversify.config.js';
import { TYPES } from '@/types/layer.types.js';
import { ImageController } from '@/controllers/image.controller.js';

const imageRouter = express.Router();

const imageController = container.get<ImageController>(TYPES.ImageController);

imageRouter
  .route('/')
  .post(
    authentication(),
    upload.single('image'),
    asyncHandler(imageController.postImage),
  );

export default imageRouter;
