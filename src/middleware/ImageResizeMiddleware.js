import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const resizeDir = 'resized';
if (!fs.existsSync(resizeDir)) {
  fs.mkdirSync(resizeDir);
}

export const resizeImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const filename = req.file.filename;
    const resizedPath = path.join(resizeDir, `resized-${filename}`);

    await sharp(req.file.path)
      .resize({ width: 500, height: 700 })
      .toFile(resizedPath);

    req.file.path = resizedPath;

    next();
  } catch (error) {
    next(error);
  }
};
