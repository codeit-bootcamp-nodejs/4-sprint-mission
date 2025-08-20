require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middlewares/error-handler.middleware');
const apiRouter = require('./api');

const app = express();

// CORS 설정
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 제공 (이미지 업로드용)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API 라우터
app.use('/api', apiRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

// 전역 에러 핸들러
app.use(errorHandler);

module.exports = app;
