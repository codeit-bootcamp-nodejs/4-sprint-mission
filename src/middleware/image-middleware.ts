import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export class ImageMiddleware {
  public upload: multer.Multer;
  private uploadDir = 'uploads';
  private resizeDir = 'resized';

  constructor() {
    if (!fs.existsSync(this.uploadDir)) fs.mkdirSync(this.uploadDir);
    if (!fs.existsSync(this.resizeDir)) fs.mkdirSync(this.resizeDir);

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.uploadDir);
      },
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
      },
    });

    this.upload = multer({ storage });
  }

  resize = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return next();
    }

    try {
      const filename = req.file.filename;
      const resizedPath = path.join(this.resizeDir, `resized-${filename}`);

      await sharp(req.file.path)
        .resize({ width: 500, height: 700 })
        .toFile(resizedPath);

      req.file.path = resizedPath;
      next();
    } catch (error) {
      next(error);
    }
  };
}