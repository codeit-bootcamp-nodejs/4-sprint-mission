import express from "express";
import router from './SRC/routes/index.routes.js'
import prisma from './lib/prisma.js'; // 이렇게 import만

const app = express();
app.use(express.json());

// 테스트할 라우터만 연결
app.use("/", router);

app.listen(3000, () => console.log("Test server running on 3000"))
