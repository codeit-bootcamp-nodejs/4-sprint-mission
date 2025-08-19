import express from "express";
import dotenv from "dotenv";
import productRouter from "./routers/productRouter.js";
import articleRouter from "./routers/articleRouter.js";


dotenv.config();
const app = express();
app.use(express.json());



app.get("/hello/a/b", (req, res) => {
    res.send({ id: "user" });
});

// app.get("/products", (req, res) => {
//     res.send({ id: "user" });
// });

app.use("/products", productRouter);
app.use("/articles", articleRouter);


app.listen(3000, () => {
    console.log("나 시작했어");
});