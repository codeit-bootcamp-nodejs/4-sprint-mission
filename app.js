import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import productRouter from './productRouter.js';
import articleRouter from './articleRouter.js';
import commentRouter from './commentRouter.js';

const router = express.Router();

const app = express();

const prisma = new PrismaClient();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use('/products', productRouter);
app.use('/articles', articleRouter);
app.use('/comments', commentRouter);

const upload = multer({ dest: 'uploads/'})

app.post('/photos', upload.single('image'), (req, res) => {
  const path = 'download/' + req.file.filename;
  res.json({ path });
});

app.use('/downlaod', express.static('uploads'));

const corsOptions = {
  origin: 'http://localhost:3000',
  optionSuccessStatus: 200
}

app.use(cors(corsOptions));

// app.use((err, res, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
