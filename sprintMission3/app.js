import * as dotenv from 'dotenv';
import express from 'express';
import productsRouter from './routes/ProductRoute.js';
import articlesRouter from './routes/ArticleRoute.js';
import uploadsRouter from './routes/ImageRoute.js';
import commentsRouter from './routes/CommentRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/products', productsRouter);
app.use('/articles', articlesRouter);
app.use('/comments', commentsRouter);
app.use('/uploads', uploadsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
