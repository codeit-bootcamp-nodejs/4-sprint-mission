import multer from 'multer';

// 이미지 파일은 모두 image/로 mimetype이 시작합니다.
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('이미지 파일만 업로드할 수 있습니다.'), false);
  }
};

const upload = multer({
  dest: 'upload/',
  fileFilter,
});

export default upload;
