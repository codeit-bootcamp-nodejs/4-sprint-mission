// 경로 처리를 위한 모듈.
const path = require('path');
// 파일 시스템 관련 기능을 사용하기 위한 모듈.
const fs = require('fs');
// Express 웹 프레임워크를 사용하기 위한 모듈.
const express = require('express');
// 파일 업로드 처리를 위한 multer 모듈.
const multer = require('multer');
// 비동기 에러 처리를 간편하게 하기 위한 유틸 함수.
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();
// 업로드된 파일을 저장할 폴더 경로를 지정.
// 폴더가 없으면 생성하기 위해 경로를 미리 정의.
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
// 업로드 폴더가 없으면 새로 생성합니다.
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
    // 업로드된 파일이 저장될 폴더를 지정.
    destination: function (req, file, cb) { cb(null, UPLOAD_DIR); },
    // 저장될 파일명을 지정.
    // 현재 시간과 랜덤 숫자를 조합해 고유한 이름을 만들고
    // 원본 파일의 확장자를 유지하기 위해 path.extname을 사용.
    filename: function (req, file, cb) {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, unique + ext);
    }
});
// multer 설정을 사용해 단일 파일 업로드를 처리.
const upload = multer({ storage });

// '/image' 경로로 POST 요청 시 이미지 파일 하나를 업로드\.
// 'image' 필드에서 파일을 받아 처리.
router.post('/image', upload.single('image'), asyncHandler(async (req, res) => {
    // 파일이 없으면 400 에러를 반환.
    if (!req.file) return res.status(400).json({ error: '이미지 파일이 필요합니다.' });
    // 업로드된 파일의 상대 경로를 클라이언트에 전달.
    const relPath = `/uploads/${req.file.filename}`;
    res.status(201).json({ path: relPath });
}));

module.exports = router;