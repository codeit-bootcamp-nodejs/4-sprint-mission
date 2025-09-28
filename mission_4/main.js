import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import productRouter from './src/router/productRouter.js';
import articleRouter from './src/router/articleRouter.js';
import imageRouter from './src/router/imageRouter.js';
import userRouter from './src/router/userRouter.js';

import errorHandler from './src/handler/errorHandler.js';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors({
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}));
app.use(cookieParser());

function logRequest(req, _, next) {
  console.log(`[${req.method}] ${req.originalUrl}`)
  next();
}

// middleware for logging all http request
app.use(logRequest);

app.use('/products', productRouter);
app.use('/articles', articleRouter);
app.use('/upload', imageRouter);
app.use(userRouter);

app.use(errorHandler);
app.use('/upload', express.static('uploads'));

app.listen(PORT, () => console.log(`Server started on port ${PORT}..`));