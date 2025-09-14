import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from './lib/passport/passport.js';

import authRouter from './controller/authController.js';
import productRouter from './controller/productController.js';
import articleRouter from './controller/articleController.js';
import userRouter from './controller/userController.js';
import  { errorMiddleWare }  from './middlewares/error.js';

const app = express()
const PORT = process.env.PORT || 3000;  

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize()); 


app.use('/auth', authRouter);
app.use('/products', productRouter);
app.use('/articles', articleRouter);
app.use('/user', userRouter)


//서버 테스트
app.get('/', (req, res) => {
  console.log('hello world');
})

app.use(errorMiddleWare);

// 서버 시작
app.listen(PORT,() =>{
  console.log(`Server is running on http://localhost:${PORT}`);
});

//애플리케이션 종료 시 Prisma클라이언트 연결 해제 
process.on('beforeExit', async () =>{
  await prisma.$disconnect();
});
