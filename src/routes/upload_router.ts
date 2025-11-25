import express from "express";
import path from "path";
import multer from "multer";
import fs from "fs";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const router = express.Router();

// const UPLOADS_FOLDER = path.join(process.cwd(), "uploads");
// if (!fs.existsSync(UPLOADS_FOLDER))
//   fs.mkdirSync(UPLOADS_FOLDER, { recursive: true });

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, UPLOADS_FOLDER);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   },
// });

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.array("files", 3), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "업로드할 파일이 없습니다." });
    }
    // const urls = files.map(
    //   (file) => `http://localhost:3000/uploads/${file.filename}`
    // );

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const filename = Date.now() + "-" + file.originalname;
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: file.filename,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await s3Client.send(command);
      const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.filename}`;
      uploadedUrls.push(fileUrl);
    }
    res.status(201).json({ urls: uploadedUrls });
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).json({ message: "파일 업로드 중 오류가 발생했습니다." });
  }
});

router.delete("/", async (req, res) => {
  const { key } = req.body;
  if (!key) {
    return res.status(400).json({ message: "삭제할 파일 키가 없습니다." });
  }
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
    });

    await s3Client.send(command);
    res.status(200).json({ message: "파일이 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("File delete error:", error);
    res.status(500).json({ message: "파일 삭제 중 오류가 발생했습니다." });
  }
});

export default router;
