import { Router } from 'express';
import UploadController from '../controllers/UploadController';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const router = Router();

//uploads 디렉토리가 없을 때 생성
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadController = new UploadController();

//image api
router.post('/upload', upload.single('image'), uploadController.uploadImage);

export default router;
