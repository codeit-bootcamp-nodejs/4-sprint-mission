import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import productsRouter from './routes/ProductRoute.js';
import articlesRouter from './routes/ArticleRoute.js';
import uploadsRouter from './routes/ImageRoute.js';
import commentsRouter from './routes/CommentRoute.js';
import { errorHandler } from './middleware/ErrorHandlerMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.use('/products', productsRouter);
app.use('/articles', articlesRouter);
app.use('/comments', commentsRouter);
app.use('/uploads', uploadsRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
