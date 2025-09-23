import express from 'express';

import { articleRouter } from './components/articles/articles.routes.js';
import { sessionRouter } from './components/auth/sessions/sessions.router.js';
import { tokenRouter } from './components/auth/tokens/tokens.router.js';
import { commentRouter } from './components/comments/comments.routes.js';
import { likeRouter } from './components/likes/likes.routes.js';
import { productRouter } from './components/products/products.routes.js';
import { userRouter } from './components/users/users.routes.js';
import errorHandler from './middlewares/error-handler.js';

const app = express();

app.use(express.json());

app.use('/sessions', sessionRouter);
app.use('/tokens', tokenRouter);
app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/articles', articleRouter);
app.use('/comments', commentRouter);
app.use('/likes', likeRouter);

app.use(errorHandler);
app.route('/status').get((req, res) => {
  res.status(200).send('OK');
});

export default app;
