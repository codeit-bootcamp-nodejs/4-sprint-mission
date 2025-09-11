import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/error.js';
import articlesRoute from './route/articles-route.js';
import productsRoute from './route/products-route.js';
import userRoute from './route/user-route.js';
import imagesRoute from './middleware/images.js';

const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json());

app.use(cors({
    origin : [
      'http://localhost:3000'
    ],
    credentials: true
}));

app.use('/', articlesRoute);
app.use('/', productsRoute);
app.use('/', imagesRoute);

app.use('/', userRoute);

app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});