import express from 'express'
import  type { RequestHandler } from 'express'
import indexRouter from "./routes/index.routes"
import cookieParser from 'cookie-parser';
import errorHandler from "./middleware/errorMiddle";
const app = express();

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send("Hello World");
});

// API 라우터
app.use("/api", indexRouter);

app.use(errorHandler);


app.listen(3000, () => {
  console.log('Server running on port 3000!');
});