import { Request, Response } from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  PUBLIC_PATH,
  STATIC_PATH,
  NODE_ENV,
  AWS_S3_BUCKET_NAME,
  AWS_S3_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY
} from '../lib/constants';
import BadRequestError from '../lib/errors/BadRequestError';

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;

// S3 클라이언트 설정
const s3Client = new S3Client({
  region: AWS_S3_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

// 환경에 따라 storage 설정 분기
const storage = NODE_ENV === 'production'
  ? multerS3({
      s3: s3Client,
      bucket: AWS_S3_BUCKET_NAME,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const filename = `${uuidv4()}${ext}`;
        cb(null, filename);
      },
    })
  : multer.diskStorage({
      destination(req, file, cb) {
        cb(null, PUBLIC_PATH);
      },
      filename(req, file, cb) {
        const ext = path.extname(file.originalname);
        const filename = `${uuidv4()}${ext}`;
        cb(null, filename);
      },
    });

export const upload = multer({
  storage,
  limits: {
    fileSize: FILE_SIZE_LIMIT,
  },

  fileFilter: function (req, file, cb) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      const err = new BadRequestError('Only png, jpeg, and jpg are allowed');
      return cb(err);
    }

    cb(null, true);
  },
});

export async function uploadImage(req: Request, res: Response) {
  if (!req.file) {
    throw new BadRequestError('File is required');
  }

  let url: string;

  if (NODE_ENV === 'production') {
    // S3 URL 반환 (multer-s3가 자동으로 location 속성 추가)
    url = (req.file as any).location;
  } else {
    // 로컬 파일 URL 반환
    const host = req.get('host');
    if (!host) {
      throw new BadRequestError('Host is required');
    }
    const filePath = path.join(host, STATIC_PATH, req.file.filename);
    url = `http://${filePath}`;
  }

  res.send({ url });
}
