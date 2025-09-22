import multer from "multer";
import path from "path";
import { de, fi } from "zod/locales";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../image/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export default upload;
