import productRouter from './API/product/product.router.js';
import articleRouter from './API/article/article.router.js';
import commentRouter from './API/CommentAPI.js'
import uploadRouter from'./API/Image/ImageAPI.js'
import express from 'express';

const app = express();
app.use(express.json()); // <- 이거 꼭 있어야 req.body 쓸 수 있음

const PORT  = process.env.PORT ||3000;
console.log("서버시작");


app.use('/product', productRouter);
app.use('/article',articleRouter);
app.use('/comment', commentRouter);
app.use('/upload',uploadRouter);


app.listen(PORT,()=> {
    console.log(`서버 실행중 ${PORT}`)
})