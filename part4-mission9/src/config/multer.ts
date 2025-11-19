import { S3Client } from '@aws-sdk/client-s3';
import multer, { type FileFilterCallback } from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';

import { dirnameFromMeta } from '../lib/dirname.js';

const __dirname_safe = dirnameFromMeta(import.meta.url);

const isProd = process.env.NODE_ENV === 'production';

/* ------------ 공통 파일 필터 (이미지 전용) ------------ */
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const err = new multer.MulterError('LIMIT_UNEXPECTED_FILE');
    (err as unknown as { message: string }).message =
      '이미지 파일만 업로드할 수 있습니다.';
    cb(err);
  }
};

/* ------------ 스토리지 엔진 결정 (dev: 로컬, prod: S3) ------------ */
let storage: multer.StorageEngine;

if (isProd) {
  //  프로덕션: S3로 업로드
  const s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  storage = multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET!,
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const filename = `${file.fieldname}-${Date.now()}${ext}`;
      cb(null, filename);
    },
  });
} else {
  //  개발/테스트: 로컬 디스크 저장
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname_safe, '../uploads'));
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${Date.now()}${ext}`);
    },
  });
}

/* ------------ Multer 미들웨어 ------------ */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5,
  },
});

export default upload;
