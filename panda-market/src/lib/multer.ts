import multer, { FileFilterCallback } from 'multer';
import multerS3 from 'multer-s3';
import { ImageType } from '@/types/image.types.js';
import { BadRequestError } from '@/lib/errors.js';
import { Request } from 'express';
import { NODE_ENV } from '@/lib/constants.js';
import { getS3Client } from '@/lib/s3-client.js';
import path from 'path';

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

let storage;

if (NODE_ENV === 'production') {
  storage = multerS3({
    s3: getS3Client(),
    bucket: 'panda-market-s3-bucket',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const filename = `${Date.now()}_${path.basename(file.originalname, ext)}${ext}`;
      cb(null, `uploads/${filename}`);
    },
  });
} else {
  storage = multer.memoryStorage();
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_IMAGE_SIZE * 1024 * 1024, // MB
  },
  fileFilter: fileFilter,
});

export default upload;
