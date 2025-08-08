import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
//./router에서 각 router들 불러내기
import productRouter from './router/productRouter.js';
import articleRouter from './router/articleRouter.js';
import commentRouter from './router/commentRouter.js';

const router = express.Router();

const app = express();

const prisma = new PrismaClient();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use('/products', productRouter);
app.use('/articles', articleRouter);
app.use('/comments', commentRouter);

const upload = multer({ dest: 'uploads/'}) // multer를 통해 업로드된 사진이 저장될 폴더

app.post('/photos', upload.single('image'), (req, res) => {  // ./photo라는 경로에서  ./uploads/에 있는 파일을 서빙
  const path = 'download/' + req.file.filename;
  res.json({ path }); // 업로드 됬을 시, 사진의 저장된 위치를 알려줌으로써 확인 가능
});

app.use('/downlaod', express.static('uploads'));

const corsOptions = { //CORS 설정
  origin: 'http://localhost:3000',
  optionSuccessStatus: 200
}

app.use(cors(corsOptions));

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
