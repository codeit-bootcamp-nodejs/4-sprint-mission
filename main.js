import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import container from './src/container.js';
import productRouter from './src/routes/product.route.js';
import articleRouter from './src/routes/article.route.js';
import imageRouter from './src/routes/image.route.js';
import userRouter from './src/route/user-router.js';
import { errorHandler } from './src/middleware/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const {
  productController,
  articleController,
  commentController,
  imageController,
  userController,
  validationMiddleware,
  imageMiddleware,
} = container;

app.use(
  '/products',
  productRouter(productController, commentController, validationMiddleware),
);
app.use(
  '/articles',
  articleRouter(articleController, commentController, validationMiddleware),
);
app.use('/users', userRouter(userController));
app.use('/uploads', imageRouter(imageController, imageMiddleware));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
