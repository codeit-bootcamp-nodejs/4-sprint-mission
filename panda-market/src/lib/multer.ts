import multer, { FileFilterCallback } from 'multer';
import { ImageType } from '@/types/image.types.js';
import { BadRequestError } from './errors.js';
import { Request } from 'express';

const MAX_IMAGE_SIZE = 5;

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  if (ImageType.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestError('잘못된 요청입니다'));
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_IMAGE_SIZE * 1024 * 1024, // MB
  },
  fileFilter: fileFilter,
});

export default upload;
