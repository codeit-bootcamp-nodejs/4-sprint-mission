// src/app.js
const express = require('express');
const app = express();
const port = process.env.SERVER_PORT || 3000;

app.use(express.json());

app.use('/products', require('./routes/product'));
app.use('/articles', require('./routes/article'));
app.use('/comments', require('./routes/comment'));
app.use('/upload', require('./routes/upload'));

app.use(require('./middlewares/errorHandler'));

app.listen(port, () => {
  console.log(`✅ 서버가 성공적으로 열렸습니다! 포트: ${port}`);
});

module.exports = app;