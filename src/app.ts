import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

// 라우터 import
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import productRoutes from './routes/products';
import postRoutes from './routes/posts';
import commentRoutes from './routes/comments';

// 타입 import
import { ApiError } from './types';

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors()); // CORS 설정
app.use(express.json()); // JSON 파싱
app.use(express.urlencoded({ extended: true })); // URL 인코딩 파싱

// 요청 로깅 미들웨어
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 라우터 설정
app.use('/api/auth', authRoutes); // 인증 관련 API
app.use('/api/users', userRoutes); // 사용자 관련 API
app.use('/api/products', productRoutes); // 상품 관련 API
app.use('/api/posts', postRoutes); // 게시글 관련 API
app.use('/api/comments', commentRoutes); // 댓글 관련 API

// 기본 라우트
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: '토큰 기반 유저 인증/인가 API 서버 - TypeScript',
    version: '1.0.0',
    typescript: true,
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      products: '/api/products',
      posts: '/api/posts',
      comments: '/api/comments'
    },
    documentation: {
      signup: 'POST /api/auth/signup',
      login: 'POST /api/auth/login',
      refresh: 'POST /api/auth/refresh',
      logout: 'POST /api/auth/logout',
      profile: 'GET /api/users/me',
      products: 'GET /api/products',
      posts: 'GET /api/posts'
    }
  });
});

// 존재하지 않는 라우트 처리
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: '요청하신 리소스를 찾을 수 없습니다.',
    path: req.originalUrl,
    method: req.method
  });
});

// 전역 에러 핸들러
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error('전역 에러 핸들러:', error);
  
  // Prisma 에러 처리 - 중복 키
  if (error.code === 'P2002') {
    return res.status(409).json({
      error: '중복된 데이터입니다.',
      detail: error.meta?.target || 'Unique constraint failed'
    });
  }
  
  // Prisma 에러 처리 - 레코드를 찾을 수 없음
  if (error.code === 'P2025') {
    return res.status(404).json({
      error: '요청하신 데이터를 찾을 수 없습니다.'
    });
  }

  // Validation 에러 처리
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: '입력값 검증 오류',
      details: error.details
    });
  }

  // JWT 에러 처리
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: '유효하지 않은 토큰입니다.'
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: '토큰이 만료되었습니다.'
    });
  }

  // 커스텀 API 에러 처리
  if (error.status) {
    return res.status(error.status).json({
      error: error.message || '요청 처리 중 오류가 발생했습니다.',
      ...(error.details && { details: error.details })
    });
  }

  // 기본 에러 응답
  const status = error.status || error.statusCode || 500;
  const message = error.message || '서버 내부 오류가 발생했습니다.';
  
  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: error.stack,
      details: error 
    })
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 TypeScript 서버가 포트 ${PORT}에서 실행중입니다.`);
  console.log(`📍 로컬 주소: http://localhost:${PORT}`);
  console.log(`📋 API 문서: http://localhost:${PORT}/`);
  console.log(`🔷 TypeScript 컴파일 모드로 실행됨`);
});

// Graceful shutdown 처리
process.on('SIGTERM', () => {
  console.log('SIGTERM 신호를 받았습니다. 서버를 종료합니다...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT 신호를 받았습니다. 서버를 종료합니다...');
  process.exit(0);
});

export default app;