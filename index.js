require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

//import router
const productRouter = require('./rotes/products.router.js');
const articleRouter = require('./routes/articles.router,js');
const uploadRouter = require('./routes.upload.router.js');

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path,join(__dirname, 'uploads')));


//route settitng
app.use('/api', [productRouter, articleRouter, uploadRouter]);

//Error Handler Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || '오류가 발생했습니다.';
  res.status(statusCode).json({ message });
});


app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번에서 실행중입니다.`);
});

