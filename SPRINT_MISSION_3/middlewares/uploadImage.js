import multer from 'multer';
import path from 'path';
import fs from 'fs';

// 업로드 경로 설정
const uploadDir = path.join(process.cwd(), 'uploads');

// uploads 폴더 없으면 생성
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    const timestamp = Date.now();
    cb(null, `${basename}-${timestamp}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 제한
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('지원하지 않는 파일 형식입니다.'), false);
    }
    cb(null, true);
  },
});

export default upload;
