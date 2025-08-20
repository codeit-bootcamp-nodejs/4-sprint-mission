import express from "express";
import dotenv from "dotenv";
import productRouter from "./routers/productRouter.js" 
import articleRouter from "./routers/articleRouter.js"
import commentRouter from "./routers/commentRouter.js"
import cors from "cors"
import uploadRouter from "./routers/uploadRouter.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); 
app.use(cors({
    origin: "*"
}));

app.use("/files", express.static("uploads"));

app.get('/', (req,res)=> {
    res.send("미션 3 홈페이지입니다");
});

app.use('/products', productRouter); 
app.use('/articles', articleRouter);
app.use('/comments', commentRouter);
app.use('/files', uploadRouter);

app.all(/(.*)/, (req, res) => {
    res.status(404).send({ message: '요청하신 리소스를 찾을 수 없습니다.' });
});

app.listen(3000, ()=> {
    console.log("서버를 시작하겠습니다-");
});

