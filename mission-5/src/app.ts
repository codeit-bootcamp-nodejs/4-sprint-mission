import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import usersRouter from "./routes/users.router.js";
import productsRouter from './routes/products.router.js';
import articlesRouter from './routes/articles.router.js';
import commentsRouter from './routes/comments.router.js'; 

// uploads 폴더가 존재하지 않으면, 폴더를 생성합니다.
const dir = './uploads';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); //body-parser middleware
app.use('/api', [usersRouter, productsRouter, articlesRouter, commentsRouter]);

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
    console.error(`[${req.method}] ${req.originalUrl} :`, err);
    res.status(500).json({ message: "서버 내부 오류 발생"});
});

app.listen(PORT, () => {
    console.log(PORT, "포트로 서버 실행중");
});