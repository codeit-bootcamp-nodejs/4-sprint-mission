import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const abs = path.join(__dirname, '../../', uploadDir);

if (!fs.existsSync(abs)) fs.mkdirSync(abs, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, abs),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '_');
    cb(null, `${base}-${Date.now()}${ext}`);
  }
});

export const uploader = multer({ storage });
export const uploadAbsDir = abs;
