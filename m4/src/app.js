import express from 'express';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';
import passport from './config/passport.js';
import errorHandler from './middlewares/errorHandler.js';
import { UPLOAD_PATH } from './config/constants.js';

const app = express();

// 보안, CORS, 로깅
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(morgan('combined'));

// 파싱
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 정적 파일
app.use('/uploads', express.static(path.resolve(UPLOAD_PATH)));

// Passport 초기화
app.use(passport.initialize());

// API 라우트
app.use('/', routes);

// 기본 라우트
app.get('/', (req, res) => {
    res.json({
        message: 'Sprint 4 - 토큰 기반 인증 API',
        version: '1.0.0',
    });
});

// 에러 핸들러
app.use(errorHandler);

export default app;
