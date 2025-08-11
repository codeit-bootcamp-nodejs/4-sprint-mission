import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';


// _dirname 대체 (ES 모듈용)
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const UPLOAD_DIR = path.join(_dirname, '../uploads');

// 저장 위치 및 파일 이름 설정
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR); // uploads 폴더에 저장
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // 확장자 추출
    const basename = path.basename(file.originalname, ext); // 파일명
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${basename}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ storage });

export default upload;