import express from 'express';
import upload from '../middlewares/uploadImage.js';

const router = express.Router();

router.post('/image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '파일이 업로드되지 않았습니다.' });
  }

  res.status(200).json({
    message: '업로드 성공',
    imageUrl: `/uploads/${req.file.filename}`,
  });
});

export default router;
