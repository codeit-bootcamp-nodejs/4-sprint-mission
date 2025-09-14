import express from 'express';
import dotenv from 'dotenv';
import errorHandler from './middlewares/errorHandler.js';
import userController from './controllers/userController.js';
import productController from './controllers/productController.js';
import postController from './controllers/postController.js';
import commentController from './controllers/commentController.js';
import passport from './config/passport.js';


dotenv.config();

const app = express();
app.use(express.json());
app.use(passport.initialize());
app.use('/users', userController);
app.use('/products', productController);
app.use('/posts', postController);
app.use('/comments', commentController);


const port = process.env.PORT || 3000;

app.use(errorHandler);

app.listen(port, () => {
    console.log(`🌌 Server is running on port ${port} 🌌`)
})