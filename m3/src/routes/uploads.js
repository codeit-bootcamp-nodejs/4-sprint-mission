import express from 'express';
import asyncHandler from '../core/middlewares/asyncHandler.js';
import upload from '../core/middlewares/multer.js';
import { fileService } from '../services/fileService.js';

const uploadsRouter = express.Router();

uploadsRouter.post(
  '/',
  upload.single('attachment'),
  asyncHandler(async (req, res) => {
    try {
      const fileInfo = fileService.processUploadedFile(req.file);
      res.json(fileInfo);
    } catch (error) {
      // fileService에서 던진 에러를 처리합니다.
      return res.status(400).json({ message: error.message });
    }
  }),
);

export default uploadsRouter;
