import express from "express";
import dotenv from "dotenv";
import productRouter from "./routers/productRouter.js" //갖고 옴
import articleRouter from "./routers/articleRouter.js"
import commentRouter from "./routers/commentRouter.js"


dotenv.config();
const app = express();

app.use(express.json()); //경로 생략함. 모든 경로에 적용되게 해놓음

app.get('/hello', (req,res)=> {
    res.send("안넝?");
});

app.use('/products', productRouter); //1번 경로(생략가능), 2번 인자는 핸들러 
app.use('/articles', articleRouter);
app.use('/comments', commentRouter);

app.listen(3000, ()=> {
    console.log("나 시작할게");
});

