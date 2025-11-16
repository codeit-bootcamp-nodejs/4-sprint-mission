import { Router } from 'express';
import passport from 'passport';
import upload from '../config/multer.js';
import { uploadImage } from '../controllers/imageController.js';

const router = Router();

// 단일 이미지 업로드 라우트 (인증 필요)
router.post(
    '/upload',
    passport.authenticate('accessToken', { session: false }),
    upload.single('image'),
    uploadImage
);

export default router;
