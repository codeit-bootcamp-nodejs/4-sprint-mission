import express from 'express';
import multer from 'multer';
import path from 'path';

const app = express();
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // 저장 경로
  },
  filename: (req, file, cb) => {
    // 파일 이름: timestamp-원본이름
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploads = multer({ storage });

router.route('/images')
  .post(uploads.array('files'), (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ message: '파일이 없습니다.' });
    }
    const host = req.protocol + '://' + req.get('host');
    const urls = files.map((file) => `${host}/uploads/${file.filename}`);
    res.json({ urls });
  } catch (error) {
    console.error('POST /images Error:', error);
    res.status(500).json({ message: '이미지 업로드 중 오류가 발생했습니다.' });
  }
});

export default router;