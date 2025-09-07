import express from 'express';
import 'dotenv/config';
import cors from 'cors';

//import { errorMiddleWare } from './middleware/errorMiddleWare.js';

import passport from './lib/passport/passport.js'



const app = express()

const PORT = process.env.PORT || 3000;  

app.use(cookieParser());
app.use(passport.initialize);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



//app.use(errorMiddleWare);

// 서버 시작
app.listen(PORT,() =>{
  console.log(`Server is running on http://localhost:${PORT}`);
});

//애플리케이션 종료 시 Prisma클라이언트 연결 해제 
process.on('beforeExit', async () =>{
  await prisma.$disconnect();
});
