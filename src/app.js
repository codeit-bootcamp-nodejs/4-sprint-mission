import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import productRouter from './routes/productRouter';
import articleRouter from './routes/articleRouter';
import commentRouter from './routes/commentRouter';
import imageRouter from './routes/imageRouter';
import errorHandler from './middleware/errorHandler';

dotenv.config(); // process.env 객체에 환경변수의 key-value 값을 넣어줌.

const app = express();

app.use(cors());
app.use(express.json());

//API 라우트 연결

app.use('/products', productRouter);
app.use('/articles', articleRouter);
app.use('/', commentRouter);
app.use('/images', imageRouter);

// 404처리
app.use((req, res, next) => {
  res.status(404).json({ error: '존재하지 않는 주소입니다.' });
});

// 에러 핸들러 미들웨어
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`서버가 ${port}에서 시작되었습니다.`);
});
