import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import {
    UPLOAD_PATH,
    MAX_FILE_SIZE,
    IS_PRODUCTION,
} from './constants.js';

// 개발 환경: 로컬 저장소만 사용 (S3 모듈 import 안 함)
if (!fs.existsSync(UPLOAD_PATH)) {
    fs.mkdirSync(UPLOAD_PATH, { recursive: true });
}

const localStorage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, UPLOAD_PATH);
    },
    filename: (_req, file, cb) => {
        const extname = path.extname(file.originalname);
        const filename = `${uuidv4()}${extname}`;
        cb(null, filename);
    },
});

// 프로덕션 환경에서만 S3 import
let s3Storage: any = null;
if (IS_PRODUCTION) {
    const { S3Client } = await import('@aws-sdk/client-s3');
    const multerS3Module = await import('multer-s3');
    const multerS3 = multerS3Module.default;

    const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_S3_BUCKET } = await import('./constants.js');

    if (AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY && AWS_REGION && AWS_S3_BUCKET) {
        const s3Client = new S3Client({
            region: AWS_REGION,
            credentials: {
                accessKeyId: AWS_ACCESS_KEY_ID,
                secretAccessKey: AWS_SECRET_ACCESS_KEY,
            },
        });

        s3Storage = multerS3({
            s3: s3Client,
            bucket: AWS_S3_BUCKET,
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: (_req, file, cb) => {
                const extname = path.extname(file.originalname);
                const filename = `uploads/${uuidv4()}${extname}`;
                cb(null, filename);
            },
        });
    }
}

// 스토리지 선택: 프로덕션이고 S3 설정이 있으면 S3, 아니면 로컬
const storage = IS_PRODUCTION && s3Storage ? s3Storage : localStorage;

// 업로드 미들웨어 설정
const upload = multer({
    storage,
    limits: {
        fileSize:
            typeof MAX_FILE_SIZE === 'string' ? parseInt(MAX_FILE_SIZE, 10) : MAX_FILE_SIZE || 5 * 1024 * 1024,
    },
    fileFilter: (_req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('지원하지 않는 파일 형식입니다.'));
        }
    },
});

export default upload;
