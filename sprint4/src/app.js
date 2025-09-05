//src/app.js

const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');

// 환경 변수 로드
dotenv.config();

const app = express();

// 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우터 등록
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// 기본 라우트
app.get('/', (req, res) => {
  res.send('API 서버가 실행 중입니다.');
});

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '서버 오류가 발생했습니다.' });
});

module.exports = app;