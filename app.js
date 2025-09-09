import express from 'express';
import cors from 'cors';
import { errorHandler } from './sprint3/error.js';
import articlesRoute from './sprint3/route/articles-route.js';
import productsRoute from './sprint3/route/products-route.js';


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

app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});