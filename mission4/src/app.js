import express from 'express';
import cookieParser from 'cookie-parser';
import router from './routers/index.js';
import { PORT } from './lib/constants.js';
import passport from './lib/passport/index.js';
import cors from 'cors';

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());
app.use(router);
app.use('/download', express.static('uploads'));

const corsOptions = { //CORS 설정 및 whitelist로 'http://localhost:3000'을 설정
  origin: 'http://localhost:3000',
  optionSuccessStatus: 200
}

app.use(cors(corsOptions));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
