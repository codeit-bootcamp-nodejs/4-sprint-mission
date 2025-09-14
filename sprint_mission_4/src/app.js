import express from 'express';
import dotenv from 'dotenv';
import errorHandler from './middlewares/errorHandler.js';
import userController from './controllers/userController.js';
import productController from './controllers/productController.js';
import postController from './controllers/postController.js';
import commentController from './controllers/commentController.js';
import passport from './config/passport.js';


dotenv.config();

const app = express();
app.use(express.json());
app.use(passport.initialize());
//Passport라는 로그인 시스템이 **"이제부터 로그인 작업을 시작할 거야!"**라고 알려주는 역할
// 이 코드가 실행되면, Passport는 모든 요청(req)마다 로그인 관련 정보를 담을 수 있는 **빈 가방(초기화된 상태)**을 준비해 줌
// 덕분에 나중에 로그인할 때 필요한 정보를 이 가방에 깔끔하게 넣을 수 있게 됨
// 결론적으로, 이 코드는 로그인 시스템이 잘 작동할 수 있도록 제일 먼저 준비를 시키는 아주 중요한 역할을 하는 거예요.
app.use('/users', userController);
app.use('/products', productController);
app.use('/posts', postController);
app.use('/comments', commentController);


const port = process.env.PORT || 3000;

app.use(errorHandler);

app.listen(port, () => {
    console.log(`🌌 Server is running on port ${port} 🌌`)
})