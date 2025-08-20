import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb){
    const ext = path.extname(file.originalname);
    cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024},
  fileFilter: (req, file, cb) => { 
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
    if(allowedMimes.includes(file.mimetype)){
      cb(null, true);
    } else {
      cb(new Error('허용되지 않는 파일 형식입니다. (JPEG, PNG, GIF만 가능)'), false);
    }
  }
});

export default upload;

