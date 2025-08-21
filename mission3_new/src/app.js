import express from "express";
import dotenv from "dotenv";

import productRouter from "./routers/productRouter.js"
import articleRouter from "./routers/articleRouter.js"
import commentRouter from "./routers/commentRouter.js"
import cors from "cors"
import uploadRouter from "./routers/uploadRouter.js";

dotenv.config();
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;
app.use(cors({
    origin: "*"
}));

// 주의: app.use("/files", express.static("uploads")); 코드가 먼저 실행되어야 합니다..
// 정적 파일 제공은 라우팅보다 먼저 위치하는 것이 좋습니다.
app.use("/files", express.static("uploads"));


app.get('/', (req,res)=>{
    res.send("미션 3 홈페이지입니다."); 
});

app.use('/products',productRouter);//1번 경로, 2번 인자는 핸들러
app.use('/articles',articleRouter);
app.use('/comments',commentRouter);
app.use('/files',uploadRouter);

//name, description, price, tags, createdAT

app.all(/(.*)/, (req, res) => {
    res.status(404).send({ message: '요청하신 리소스를 찾을 수 없습니다.' });
});
app.listen(3000, () => {
    console.log("나 시작했어");
});
