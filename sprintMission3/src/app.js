import express from 'express';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv'; 
import cors from 'cors';
import { asyncHandler } from './asyncHandler.js';

import articleRouter from './router/article_router.js';
import productRouter from './router/product_router.js';
import articleCommentRouter from './router/comment_article_router.js';
import productCommentRouter from './router/comment_product_router.js';

import { errorMiddleWare } from './middleware/errorMiddleWare.js';
import upload from './middleware/multer.js';


dotenv.config();

const app = express()
const prisma = new PrismaClient(); 
const PORT = process.env.PORT || 3000;  

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads',express.static('uploads'));

app.use ('/articles', articleRouter);
app.use('/products', productRouter);
app.use('/products/comment',productCommentRouter);
app.use('/articles/comment',articleCommentRouter);

app.post('/upload/single', upload.single('attachment'), asyncHandler(async (req, res) => {
  try{
    if (!req.file) {
      console.error("Error: '파일이 업로드되지 않았습니다.'")
      return res.status(400).json({ message: '파일이 업로드 되지 않았습니다.'})}
    console.log('업로드된 파일: ', req.file);
    console.log('텍스트 필드 데이터: ', req.body);
    return res.status(200).json({
       message: '파일이 성공적으로 업로드되었습니다.',
       filename: req.file.filename,
       filepath: `upload/${req.file.filename}` 
      });
  } catch(error){
    if(error instanceof multer.MulterError === 'LIMIT_FIELD_SIZE'){      
      return res.status(400).json({ error: '파일 크기가 너무 큽니다.'})
      }
      console.error('파일 업로드 중 오류발생:', error);
      res.status(500).json({ error: '파일 업로드 중 오류 발생' })
    }
  }));


app.use(errorMiddleWare);

// 서버 시작
app.listen(PORT,() =>{
  console.log(`Server is running on http://localhost:${PORT}`);
});

//애플리케이션 종료 시 Prisma클라이언트 연결 해제 
process.on('beforeExit', async () =>{
  await prisma.$disconnect();
});

