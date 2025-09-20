import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import container from './container';
import productRouter from './route/product-router';
import articleRouter from './route/article-router';
import imageRouter from './route/image-router';
import userRouter from './route/user-router';
import { errorHandler } from './middleware/error-handler-middleware';

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
