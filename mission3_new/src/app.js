import express from "express";
import dotenv from "dotenv";

import productRouter from "./routers/productRouter.js"
import articleRouter from "./routers/articleRouter.js"
import commentRouter from "./routers/commentRouter.js"

dotenv.config();
const app = express();
app.use(express.json());


app.get('/hello', (req,res)=>{
    res.send("안녕?");
});

app.use('/products',productRouter);//1번 경로, 2번 인자는 핸들러
app.use('/articles',articleRouter);
app.use('/comments',commentRouter);

//name, description, price, tags, createdAT

app.listen(3000, () => {
    console.log("나 시작했어");
});
