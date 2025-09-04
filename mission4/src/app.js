import express from 'express';
import cookieParser from 'cookie-parser';
import router from './routers/index.js';
import { PORT } from './lib/constants.js';
import passport from './lib/passport/index.js';
import multer from 'multer';
import cors from 'cors';

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());
app.use(router);

const upload = multer({ dest: 'uploads/'}) // multer를 통해 업로드된 사진이 저장될 폴더

app.post('/photos', upload.single('image'), (req, res) => {  // ./photo라는 경로에서  ./uploads/에 있는 파일을 서빙
  const path = 'download/' + req.file.filename;
  res.json({ path }); // 업로드 됬을 시, 사진의 저장된 위치를 알려줌으로써 확인 가능
});

app.use('/downlaod', express.static('uploads'));

const corsOptions = { //CORS 설정 및 whitelist로 'http://localhost:3000'을 설정
  origin: 'http://localhost:3000',
  optionSuccessStatus: 200
}

app.use(cors(corsOptions));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
