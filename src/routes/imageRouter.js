import express from 'express';
import upload from '../middleware/uploadMiddleware';
import imageUploadController from '../controllers/imageUploadController';

const router = express.Router();

router.post(
  '/upload',
  upload.single('image'),
  imageUploadController.uploadImage
);

export default router;
