import express from 'express';
import usersRouter from "./src/routes/users.router.js";
import productsRouter from './src/routes/products.router.js';

const app = express();
const PORT = 3000;

app.use(express.json()); //body-parser middleware
app.use('/api', [usersRouter, productsRouter]); //users, products 라우터 연결

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: "서버 내부 오류 발생"});
});

app.listen(PORT, () => {
    console.log(PORT, "포트로 서버 실행중");
});