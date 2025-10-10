import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export class ImageMiddleware {
  constructor() {
    this.uploadDir = 'uploads';
    this.resizeDir = 'resized';

    if (!fs.existsSync(this.uploadDir)) fs.mkdirSync(this.uploadDir);
    if (!fs.existsSync(this.resizeDir)) fs.mkdirSync(this.resizeDir);

    this._initializeMulter();
  }

  _initializeMulter() {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.uploadDir);
      },
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
      },
    });

    this.upload = multer({ storage: storage });
  }

  resize = async (req, res, next) => {
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
