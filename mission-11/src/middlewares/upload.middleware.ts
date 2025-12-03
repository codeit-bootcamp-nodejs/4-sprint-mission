import { Request } from 'express';
import multer from 'multer';
import path from 'path';
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';

let s3: S3Client;
let s3Storage: multer.StorageEngine;

// 프로덕션 환경일 때만 S3 관련 설정을 초기화합니다.
if (process.env.NODE_ENV === 'production') {
  // 1. AWS S3 클라이언트 설정
  s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  // 3. AWS S3 저장소 설정
  s3Storage = multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME!,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `uploads/${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  });
}

// 2. 로컬 저장소 설정 (개발 및 테스트용)
const diskStorage = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) {
    cb(null, 'uploads/');
  },
  filename: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

// 4. 환경에 따라 스토리지 엔진 선택
const storage =
  process.env.NODE_ENV === 'production' ? s3Storage! : diskStorage;

const upload = multer({ storage: storage });

export default upload;