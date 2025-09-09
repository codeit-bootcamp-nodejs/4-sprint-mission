import multer, {} from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
// ES 모듈에서 __dirname을 사용하기 위한 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// 파일 저장 경로 및 파일명 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/saved'));
    },
    filename: (req, file, cb) => {
        // 파일명: 필드이름-현재시간.확장자
        const ext = path.extname(file.originalname); // 원본 파일의 확장자 추출
        cb(null, `${file.fieldname}-${Date.now()}${ext}`);
    },
});
// 파일 필터 설정 (이미지 파일만 허용)
const fileFilter = (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('허용되지 않는 파일 형식입니다. 이미지 파일만 업로드할 수 있습니다.'));
    }
};
// Multer 미들웨어 설정
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB로 파일 크기 제한
        files: 5, // 최대 5개 파일까지 허용 (upload.array에 사용)
    },
});
export default upload;
//# sourceMappingURL=multer.js.map