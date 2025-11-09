import { Router } from 'express';
import upload from '../config/multer.js';
import { uploadImage } from '../controllers/imageController.js';

const router = Router();

// 단일 이미지 업로드 라우트
router.post('/upload', upload.single('image'), uploadImage);

export default router;
