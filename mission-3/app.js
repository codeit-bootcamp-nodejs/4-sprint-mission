import express from 'express';
import productRouter from './router/product.js';

const app = express();
const PORT = 3000;

app.use('/product', productRouter);

app.listen(PORT, ()=>{
    console.log(`서버가 ${PORT}에서 실행중입니다.`)
})
