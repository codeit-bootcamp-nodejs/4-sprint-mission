import { Request, Response, NextFunction } from "express";
import multer from "multer";
import sharp from "sharp";
import * as dotenv from "dotenv";
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";

// .env.production 파일에서 환경 변수를 로드
// process.env.NODE_ENV가 설정되어 있다고 가정합니다.
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

// AWS S3 클라이언트 초기화
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export class ImageMiddleware {
  // 로컬 저장 대신 메모리 저장소(memoryStorage)를 사용하여 파일 버퍼를 받음
  public upload: multer.Multer;

  constructor() {
    // 기존 로컬 디렉토리 생성 로직 제거

    // multer의 저장소를 memoryStorage로 변경
    const storage = multer.memoryStorage();
    this.upload = multer({ storage });
  }

  // 메서드 이름을 resizeAndUpload로 변경 (기존 resize 로직을 대체함)
  resizeAndUpload = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return next(); // 파일이 없으면 다음 미들웨어로
    }

    try {
      const originalname = req.file.originalname;
      const fileBuffer = req.file.buffer;

      // 1. sharp를 사용하여 이미지 리사이징 (메모리 버퍼 사용)
      const resizedBuffer = await sharp(fileBuffer)
        .resize({ width: 500, height: 700, fit: "cover" })
        .toFormat("jpeg")
        .toBuffer();

      // 2. S3에 파일 업로드 (Key는 S3에 저장될 파일명)
      const uploadParams: PutObjectCommandInput = {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: `resized-${Date.now()}-${originalname}`,
        Body: resizedBuffer,
        ContentType: "image/jpeg",
        ACL: "public-read", // 퍼블릭 읽기 권한 부여
      };

      await s3.send(new PutObjectCommand(uploadParams));

      // 3. S3 URL을 생성하여 req.file.path에 저장
      const s3Url = `${process.env.AWS_S3_URL!}/${uploadParams.Key}`;

      // req.file의 경로를 S3 URL로 업데이트하여 컨트롤러에 전달
      req.file = {
        ...req.file,
        path: s3Url,
        filename: uploadParams.Key,
        location: s3Url, // S3 URL을 명확하게 저장
      } as Express.Multer.File & { location: string };

      next();
    } catch (error) {
      console.error("S3 Upload Error:", error);
      next(new Error("이미지 리사이징 및 S3 업로드 중 오류가 발생했습니다."));
    }
  };
}
