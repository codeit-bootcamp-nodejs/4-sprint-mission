import express from 'express';
import cors from 'cors';
import productRouter from './routes/products.js';
import articleRouter from './routes/articles.js';
import imageRouter from './routes/images.js';
import errorHandler from './routes/handler/errorHandler.js';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

function logRequest(req, _, next) {
  console.log(`[${req.method}] ${req.originalUrl}`)
  next();
}

// middleware for logging all http request
app.use(logRequest);

app.use('/products', productRouter);
app.use('/articles', articleRouter);
app.use('/upload', imageRouter);

app.use(errorHandler);
app.use('/upload', express.static('uploads'));

app.listen(PORT, () => console.log(`Server started on port ${PORT}..`));