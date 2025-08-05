import express from "express";
import productRoutes from "./routes/productRoutes.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/products", productRoutes);

app.get("/", (req, res) => {
  res.send("중고마켓 API 서버가 정상 실행 중입니다. /products 엔드포인트를 사용하세요.");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});