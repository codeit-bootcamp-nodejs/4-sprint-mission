import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

class UploadController {
  uploadImage = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return res.status(400).json({ message: '이미지 파일이 필요합니다.' });
    }

    try {
      const ext = path.extname(req.file.originalname);
      const filename = Date.now() + ext;
      const imagePath = path.join(uploadDir, filename);

      await sharp(req.file.buffer).resize({ width: 500 }).toFile(imagePath);

      const imageUrl = `/uploads/${filename}`;
      res.status(201).json({ imageUrl: imageUrl });
    } catch (error) {
      next(error);
    }
  };
}

export default UploadController;
