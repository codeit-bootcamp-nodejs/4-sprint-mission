import express from 'express';
import uploads from '../middleware/ImageMiddleware';
import { resizeImage } from '../middleware/ImageResizeMiddleware';

const router = express.Router();

router.post('/', uploads.single('image'), resizeImage, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '이미지 파일이 필요합니다.' });
  }

  res.status(201).json({
    message: '이미지가 성공적으로 업로드 및 리사이징되었습니다',
    path: req.file.path,
  });
});

export default router;
