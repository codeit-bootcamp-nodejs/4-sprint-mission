import express from 'express';//컨트롤러-> 서비스->레파지토리
import userController from '../src/controllers/userController.js';



const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.use('', userController);

app.get('/',(req, res) => {
    res.send("hello world");
});

app.listen (3000, () => {
    console.log('서버 시작!')
});
