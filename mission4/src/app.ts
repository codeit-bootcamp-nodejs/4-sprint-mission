import express from "express";
import dotenv from "dotenv";
import userController from './controllers/userController';
import productController from './controllers/productcontroller';
import passport from './config/passport';

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.use(passport.initialize());


app.use('', userController);
app.use('/products', productController)

app.get('/', (req, res) => {
  res.send('hello world');
});

app.listen(3000, () => {
  console.log('서버 시작!');
});
