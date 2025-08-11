import * as dotenv from 'dotenv';
import express from 'express';
import productsRouter from './sprintMission3/routes/ProductRoute.js';
import articlesRouter from './sprintMission3/routes/ArticleRoute.js';
import uploadsRouter from './sprintMission3/routes/ImageRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/products', productsRouter);
app.use('/articles', articlesRouter);
app.use('/uploads', uploadsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
