import dotenv from 'dotenv';
import express from 'express';
import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from './lib/passport/index.js';
import { requestLogger } from './middlewares/logger.js';
import { setupSwagger } from './swagger.js';

dotenv.config();

console.log('[App] DATABASE_URL at app.ts start:', process.env.DATABASE_URL);
const PORT = process.env.PORT || 3000;
const app = express();

app.use(
  cors({
    origin: [
      process.env.CORS_ORIGIN || 'http://localhost:3001',
      'https://codeit-mission3.com',
    ],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.use(cookieParser());
app.use(passport.initialize());
app.use(requestLogger);

app.use('/', routes);
setupSwagger(app);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
