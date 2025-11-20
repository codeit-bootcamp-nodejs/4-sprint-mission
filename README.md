# Pandamarket Notification System

판다마켓 실시간 알림 시스템 (Mission 8)

## 주요 기능

### 알림 시스템
- **실시간 알림**: Socket.IO를 사용한 실시간 알림 전송
- **알림 종류**:
  - `PRICE_CHANGED`: 좋아요한 상품의 가격 변동
  - `NEW_COMMENT`: 작성한 게시글에 댓글 등록

### API 엔드포인트

#### 인증
- `POST /auth/signup` - 회원가입
- `POST /auth/signin` - 로그인

#### 사용자
- `GET /users/me` - 내 정보 조회
- `PATCH /users/me` - 내 정보 수정
- `PATCH /users/me/password` - 비밀번호 변경
- `GET /users/me/notifications` - 내 알림 목록 조회 (cursor pagination)
  - Query: `cursor`, `limit`
  - Response: `list`, `totalCount`, `unreadCount`, `nextCursor`

#### 알림
- `PATCH /notifications/:id/read` - 알림 읽음 처리

#### 상품
- `POST /products` - 상품 생성
- `GET /products/:id` - 상품 조회
- `PATCH /products/:id` - 상품 수정 (가격 변경 시 좋아요한 사용자에게 알림)
- `DELETE /products/:id` - 상품 삭제

#### 게시글
- `POST /articles` - 게시글 생성
- `GET /articles/:id` - 게시글 조회
- `PATCH /articles/:id` - 게시글 수정
- `DELETE /articles/:id` - 게시글 삭제

#### 댓글
- `POST /comments` - 댓글 생성 (게시글 작성자에게 알림)
- `PATCH /comments/:id` - 댓글 수정
- `DELETE /comments/:id` - 댓글 삭제

#### 이미지
- `POST /images/upload` - 이미지 업로드

## 설치 및 실행

### 1. 패키지 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env` 파일을 생성하고 다음 내용을 설정하세요:
```
DATABASE_URL="postgresql://user:password@localhost:5432/pandamarket?schema=public"
JWT_SECRET="your-secret-key"
PORT=3000
```

### 3. 데이터베이스 마이그레이션
```bash
npx prisma migrate dev
```

### 4. Prisma Client 생성
```bash
npx prisma generate
```

### 5. 개발 서버 실행
```bash
npm run dev
```

### 6. 프로덕션 빌드 및 실행
```bash
npm run build
npm start
```

## Socket.IO 클라이언트 연결

### 연결 방법
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: {
    accessToken: 'your-jwt-token'
  }
});

// 알림 수신
socket.on('notification', (notification) => {
  console.log('New notification:', notification);
  // notification.type: 'PRICE_CHANGED' | 'NEW_COMMENT'
  // notification.payload: { productId, price } | { articleId }
});

// 연결 오류
socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});
```

## 알림 페이로드 구조

### PRICE_CHANGED
```json
{
  "id": 1,
  "userId": 123,
  "type": "PRICE_CHANGED",
  "payload": {
    "productId": 456,
    "price": 50000
  },
  "read": false,
  "createdAt": "2025-01-20T10:00:00.000Z",
  "updatedAt": "2025-01-20T10:00:00.000Z"
}
```

### NEW_COMMENT
```json
{
  "id": 2,
  "userId": 123,
  "type": "NEW_COMMENT",
  "payload": {
    "articleId": 789
  },
  "read": false,
  "createdAt": "2025-01-20T10:00:00.000Z",
  "updatedAt": "2025-01-20T10:00:00.000Z"
}
```

## 기술 스택
- **Backend**: TypeScript, Node.js, Express
- **Database**: PostgreSQL, Prisma ORM
- **Real-time**: Socket.IO
- **Authentication**: JWT
- **Validation**: Superstruct

## 프로젝트 구조
```
src/
├── controllers/      # 요청 처리 로직
├── dto/              # Data Transfer Objects
├── lib/              # 유틸리티 및 에러 클래스
├── middlewares/      # 미들웨어 (인증 등)
├── repositories/     # 데이터베이스 접근 계층
├── routers/          # 라우팅
├── services/         # 비즈니스 로직
├── structs/          # 유효성 검사 스키마
├── types/            # TypeScript 타입 정의
└── main.ts           # 애플리케이션 진입점
```

## 주요 구현 사항

### 1. 실시간 알림 시스템
- Socket.IO를 사용한 WebSocket 연결
- JWT 토큰 기반 WebSocket 인증
- 사용자별 room 분리로 개인 알림 전송

### 2. 알림 트리거
- **상품 가격 변동**: 상품 업데이트 시 가격이 변경되면 해당 상품을 좋아요한 모든 사용자에게 알림
- **댓글 작성**: 게시글에 댓글이 달리면 게시글 작성자에게 알림 (본인이 작성한 댓글 제외)

### 3. 알림 조회
- Cursor 기반 페이지네이션
- 안읽은 알림 개수 반환
- 읽음 처리 기능

## 데이터베이스 스키마
- **User**: 사용자 정보
- **Product**: 상품 정보
- **Article**: 게시글 정보
- **Comment**: 댓글 정보
- **Favorite**: 상품 좋아요
- **Like**: 게시글 좋아요
- **Notification**: 알림 (type, payload, read)
