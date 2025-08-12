import multer from "multer";
import path from "path";
import fs from "fs";

const uploadsDir = path.resolve(process.cwd(), "uploads");

// uploads 디렉토리가 없으면 생성
if(!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function( req, file, cb ){
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, path.basename(file.originalname, ext) + '-' + Date.now() + ext);
    },
});
const upload = multer({ storage: storage });

export default upload;