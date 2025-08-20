import express from 'express';
import path from 'path';
import { uploader } from '../middlewares/upload.js';

const router = express.Router();

// 이미지 업로드 API
router.post('/', uploader.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: '이미지 파일이 필요합니다.' });

  // 서버 기준 경로 반환 (정적 제공 경로와 매칭)
  const relPath = path.join(process.env.UPLOAD_DIR || 'uploads', req.file.filename);
  res.status(201).json({ path: `/${relPath}` });
});

export default router;
