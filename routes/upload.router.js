//upload route
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const { DESTRUCTION } = require('dns');

//uploads 디렉토리가 없을 때 생성
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const storage = multer.memoryStorage();

//multer middleware
const upload = multer({ storage: storage });

//image api
router.post('/upload', upload.single('image'), async(req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ message: '이미지 파일이 필요합니다.'});
    }

    try {
        const ext = path.extname(req.file.originalname);
        const filename = Date.now() + ext;
        const imagePath = path.join(uploadDir, filename);

        await sharp(req.file.buffer)
         .resize({ width: 500 })
         .toFile(imagePath);
         
        const imageUrl = `/uploads/${filename}`;
        res.status(201).json({ imageUrl: imageUrl });
    } catch (error) {
        next(error);
    }
});
   
module.exports = router;
