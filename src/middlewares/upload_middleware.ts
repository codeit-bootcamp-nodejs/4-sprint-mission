// src/middlewares/upload_middleware.ts
import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import path from 'path';

// 환경 변수 확인
const isProduction = process.env.NODE_ENV === 'production';
const uploadType = process.env.UPLOAD_TYPE || 'local';

// S3 클라이언트 설정 (프로덕션 환경일 때만)
let s3Client: S3Client | undefined;
if (isProduction && uploadType === 's3') {
    s3Client = new S3Client({
        region: process.env.AWS_REGION || 'ap-northeast-2',
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
    });
}

// 로컬 스토리지 설정
const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext);
        const newFilename = `${Date.now()}-${baseName}${ext}`;
        cb(null, newFilename);
    },
});

// S3 스토리지 설정
const s3Storage = s3Client
    ? multerS3({
        s3: s3Client,
        bucket: process.env.AWS_S3_BUCKET_NAME!,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const baseName = path.basename(file.originalname, ext);
            const newFilename = `uploads/${Date.now()}-${baseName}${ext}`;
            cb(null, newFilename);
        },
    })
    : diskStorage;

// 환경에 따라 스토리지 선택
const storage = isProduction && uploadType === 's3' ? s3Storage : diskStorage;

const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 기본 10MB
    },
});

export default upload;