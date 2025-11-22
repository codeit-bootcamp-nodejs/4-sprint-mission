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

// API 엔드포인트 목록
app.get('/', (_req, res) => {
    res.json({
        version: '1.0.0',
        service: 'Panda Market API - 토큰 기반 인증 시스템',
        endpoints: {
            system: {
                'GET /health': '서버 헬스 체크 (상태 확인)',
            },
            auth: {
                'POST /auth/signup': '회원가입',
                'POST /auth/login': '로그인 (쿠키로 리프레시 토큰 반환)',
                'POST /auth/refresh': '액세스 토큰 갱신 (리프레시 토큰 필요)',
                'POST /auth/logout': '로그아웃 (리프레시 토큰 삭제)',
            },
            users: {
                'GET /users/profile': '내 프로필 조회 (인증 필요)',
                'PUT /users/me': '내 프로필 수정 (인증 필요)',
                'PUT /users/me/password': '비밀번호 변경 (인증 필요)',
                'GET /users/me/products': '내 상품 목록 조회 (인증 필요)',
                'GET /users/me/likes/products': '내가 좋아요한 상품 목록 (인증 필요)',
                'GET /users/me/likes/posts': '내가 좋아요한 게시글 목록 (인증 필요)',
            },
            products: {
                'GET /products': '상품 목록 조회',
                'POST /products': '상품 등록 (인증 필요)',
                'GET /products/:id': '상품 상세 조회 (인증 필요)',
                'PUT /products/:id': '상품 수정 (인증 필요, 소유자만)',
                'DELETE /products/:id': '상품 삭제 (인증 필요, 소유자만)',
                'POST /products/:id/comments': '상품 댓글 작성 (인증 필요)',
                'GET /products/:id/comments': '상품 댓글 목록 조회',
                'POST /products/:id/likes': '상품 좋아요 토글 (인증 필요)',
            },
            posts: {
                'GET /posts': '게시글 목록 조회',
                'POST /posts': '게시글 등록 (인증 필요)',
                'GET /posts/:id': '게시글 상세 조회 (인증 필요)',
                'PUT /posts/:id': '게시글 수정 (인증 필요, 소유자만)',
                'DELETE /posts/:id': '게시글 삭제 (인증 필요, 소유자만)',
                'POST /posts/:id/comments': '게시글 댓글 작성 (인증 필요)',
                'GET /posts/:id/comments': '게시글 댓글 목록 조회',
                'POST /posts/:id/likes': '게시글 좋아요 토글 (인증 필요)',
            },
            comments: {
                'GET /comments/:id': '댓글 상세 조회',
                'PUT /comments/:id': '댓글 수정 (인증 필요, 작성자만)',
                'DELETE /comments/:id': '댓글 삭제 (인증 필요, 작성자만)',
            },
            images: {
                'POST /images/upload': '이미지 업로드 (인증 필요, S3 또는 로컬)',
            },
            notifications: {
                'GET /notifications': '알림 목록 조회 (인증 필요)',
                'GET /notifications/unread-count': '안 읽은 알림 개수 (인증 필요)',
                'PUT /notifications/:id/read': '알림 읽음 처리 (인증 필요)',
                'PUT /notifications/read-all': '모든 알림 읽음 처리 (인증 필요)',
            },
        },
        notes: {
            authentication: 'Bearer 토큰을 Authorization 헤더에 포함: "Authorization: Bearer <access_token>"',
            websocket: 'Socket.IO를 통한 실시간 알림 지원 (JWT 인증 필요)',
            likes: '좋아요는 토글 방식 (POST 요청 시 생성/취소 자동 처리)',
            storage: {
                development: '로컬 파일 시스템 (./uploads)',
                production: 'AWS S3 버킷 (이미지 URL은 S3 직접 접근)',
            },
        },
    });
});

// 헬스 체크 엔드포인트
app.get('/health', (_req, res) => {
    res.json({
        status: 'healthy',
        service: 'Panda Market API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
    });
});

// API 라우트
app.use('/', routes);

// 에러 핸들러
app.use(errorHandler);

export default app;
