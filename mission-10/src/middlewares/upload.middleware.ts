import { Request } from 'express';
import multer from 'multer';
import path from 'path';
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';
import dotenv from 'dotenv';

// 환경변수 로드
dotenv.config();

// 1. AWS S3 클라이언트 설정
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

// 2. 로컬 저장소 설정 (기존 코드 유지 - 개발용)
const diskStorage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    cb(null, 'uploads/');
  },
  filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

// 3. AWS S3 저장소 설정 (추가된 코드 - 배포용)
const s3Storage = multerS3({
  s3: s3,
  bucket: process.env.AWS_S3_BUCKET_NAME as string,
  acl: 'public-read', // 이미지가 공개되어야 하므로 public-read 설정
  contentType: multerS3.AUTO_CONTENT_TYPE, // 파일 타입을 자동으로 설정 (이게 없으면 다운로드됨)
  key: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    // S3 내의 'uploads' 폴더에 저장되도록 설정
    cb(null, `uploads/${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// 4. 환경에 따라 스토리지 엔진 선택
// NODE_ENV가 'production'일 때만 S3를 사용하고, 그 외에는 로컬 디스크를 사용합니다.
const storage = process.env.NODE_ENV === 'production' ? s3Storage : diskStorage;

const upload = multer({ storage: storage });

export default upload;