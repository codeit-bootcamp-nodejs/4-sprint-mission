import * as dotenv from 'dotenv';
import express from 'express';
import productsRouter from './sprintMission3/routes/products.routes.js';
import uploadsRouter from './sprintMission3/routes/uploads.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/products', productsRouter);
app.use('/uploads', uploadsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
