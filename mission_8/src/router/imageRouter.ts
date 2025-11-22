import express from 'express';
import multer from "multer";

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

// 이미지 리사이징 기능 구현 예정
router.post('/', upload.single('image'), async (req, res) => {
    // console.log(req.file);
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    res.status(201).json({ message: 'Upload OK', filePath: req.file.path });
});


export default router;