const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.post('/', upload.single('image'), (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: '파일이 업로드되지 않았습니다.' });
  }
  res.status(201).json({
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`,
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size
  });
});

module.exports = router;