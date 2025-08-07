import express from 'express';
import productRouter from './routers/product.js';
import articleRouter from './routers/article.js';
import jsonErrorHandler from './middlewares/jsonErrorHandler.js';
import fileRouter from './routers/file.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('uploads'));
app.use(express.urlencoded({ extended: true }))

app.use('/product', productRouter);
app.use('/article', articleRouter);
app.use('/uploads', fileRouter);

app.use(jsonErrorHandler);

app.listen(PORT, ()=>{
    console.log(`서버가 ${PORT}에서 실행중입니다.`)
});
