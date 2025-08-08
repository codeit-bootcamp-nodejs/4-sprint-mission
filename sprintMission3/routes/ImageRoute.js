import express from 'express';
import uploads from '../middleware/ImageMiddleware';

const router = express.Router();

router.post('/', uploads.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '이미지 파일이 필요합니다.' });
  }
  res.status(201).json({ path: req.file.path });
});

export default router;
