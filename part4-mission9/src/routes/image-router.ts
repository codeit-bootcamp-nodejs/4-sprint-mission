import express, { type Request, type Response } from 'express';

import upload from '../config/multer.js';

const router = express.Router();
const isProd = process.env.NODE_ENV === 'production';

router.post('/upload/single', upload.single('myImage'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('파일이 업로드되지 않았습니다.');
  }

  const file = req.file;
  const filename = file.key ?? file.filename;
  const url =
    isProd && file.location ? file.location : `/uploads/${file.filename}`;

  res.status(200).json({
    message: '파일이 성공적으로 업로드되었습니다.',
    filename,
    url,
  });
});

router.post(
  '/upload/array',
  upload.array('myImages', 5),
  (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[] | undefined;

    if (!files || files.length === 0) {
      return res.status(400).send('파일이 업로드되지 않았습니다.');
    }

    const result = files.map((file) => {
      const filename = file.key ?? file.filename;
      const url =
        isProd && file.location ? file.location : `/uploads/${file.filename}`;

      return { filename, url };
    });

    res.status(200).json({
      message: '파일들이 성공적으로 업로드되었습니다.',
      files: result,
    });
  }
);

export default router;
