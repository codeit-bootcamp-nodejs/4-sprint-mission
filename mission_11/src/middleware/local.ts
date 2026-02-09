import fs from "fs";
import path from "path";
import multer from "multer";
import type { NextFunction, Request, Response } from "express";

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

export const localUpload = {
  single: (fieldName: string) => (req: Request, res: Response, next: NextFunction) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err) {
        return next(err);
      }
      if (req.file) {
        const file = req.file as Express.Multer.File;
        (file as any).location = `/uploads/${file.filename}`;
        (file as any).key = file.filename;
      }
      next();
    });
  },
};
