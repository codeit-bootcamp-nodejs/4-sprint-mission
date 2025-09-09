import express, { type Request, type Response } from 'express';
import upload from './config/multer.js';

const router = express.Router();

// 단일 이미지 업로드 라우트
router.post('/upload/single', upload.single('myImage'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('파일이 업로드되지 않았습니다.');
  }
  res.status(200).json({
    message: '파일이 성공적으로 업로드되었습니다.',
    filename: req.file.filename,
    filepath: `/uploads/${req.file.filename}`, // 클라이언트에서 접근할 수 있는 경로
  });
});

// 여러 이미지 업로드 라우트 (최대 5개)
router.post(
  '/upload/array',
  upload.array('myImages', 5),
  (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || files.length === 0) {
      return res.status(400).send('파일이 업로드되지 않았습니다.');
    }
    res.status(200).json({
      message: '파일들이 성공적으로 업로드되었습니다.',
      files: files.map((file) => ({
        filename: file.filename,
        filepath: `/uploads/${file.filename}`,
      })),
    });
  }
);

export default router;
