import express from 'express';
import { PrismaClient } from '@prisma/client';
import productRouter from './routes/product.js';
import commentRouter from './routes/comment.js';
import multer from 'multer'; 
import cors from 'cors';



const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use('/products', productRouter);
app.use('/comments', commentRouter);
app.use(cors());  


// 이미지 업로드 API
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // 업로드 폴더
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  }
});
const upload = multer({ storage });

app.post('/photos', upload.single('image'), (req, res) => {
  const filename = req.file.filename;
  res.status(200).json({ path: `/photos/${filename}` }); 
});

app.use('/photos', express.static('uploads'));


// 에러 체크
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '서버에 오류가 발생했습니다.' });
});

app.listen(3000, () => {
  console.log(`Server running on http://localhost:3000`);
});

