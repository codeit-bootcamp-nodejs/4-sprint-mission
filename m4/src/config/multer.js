import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { UPLOAD_PATH, MAX_FILE_SIZE } from './constants.js';

// 업로드 폴더가 없으면 자동 생성
if (!fs.existsSync(UPLOAD_PATH)) {
    fs.mkdirSync(UPLOAD_PATH, { recursive: true });
}

// 파일 저장 방식 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_PATH);
    },
    filename: (req, file, cb) => {
        const extname = path.extname(file.originalname);
        const filename = `${uuidv4()}${extname}`;
        cb(null, filename);
    },
});

// 업로드 미들웨어 설정
const upload = multer({
    storage,
    limits: {
        fileSize: parseInt(MAX_FILE_SIZE, 10) || 5 * 1024 * 1024, // 기본값: 5MB
    },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('지원하지 않는 파일 형식입니다.'));
        }
    },
});

export default upload;
