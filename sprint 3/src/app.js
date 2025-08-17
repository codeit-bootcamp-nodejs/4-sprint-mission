// app.js
import express from 'express'; // Express 라이브러리
import cors from 'cors'; // CORS 미들웨어


// 라우터 파일들 가져오기
import articleRouter from './src/routes/articles.js';
import productRouter from './src/routes/products.js';
import commentRouter from './src/routes/comments.js';
import uploadRouter from './src/routes/upload.js'; 

const app = express();


// -----------------------------------------------------------
// 전역 미들웨어 설정
// -----------------------------------------------------------

// CORS 설정: 모든 도메인에서의 요청을 허용
app.use(cors());

// JSON 형식의 요청 본문을 파싱하는 미들웨어
app.use(express.json());

// URL-encoded 형식의 요청 본문을 파싱하는 미들웨어
app.use(express.urlencoded({ extended: true }));

// 업로드된 이미지 등을 제공하는 미들웨어
app.use('/files', express.static('uploads'));



// -----------------------------------------------------------
// 라우터 연결
// -----------------------------------------------------------

// 각 라우터 파일을 Express 앱에 연결합니다.
app.use('/atricles', articleRouter);
app.use('/products', productRouter);
app.use('/', commentRouter);
app.use('/', uploadRouter);




// -----------------------------------------------------------
// 서버 실행
// -----------------------------------------------------------

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
