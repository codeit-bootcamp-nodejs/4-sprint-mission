# Sprint Mission 9 - Backend

판다마켓 백엔드 API 서버입니다. Prisma + PostgreSQL + Express + TypeScript로 구현되었습니다.

## 🏗️ 아키텍처

- **Featured Architecture**: 도메인 기반 폴더 구조
- **DTO + Service + Repository 패턴**
- **Prisma ORM**: 타입 안전 데이터베이스 접근
- **JWT 인증**: 사용자 인증 및 권한 관리

## 📁 프로젝트 구조

```
backend/
├── src/
│   ├── features/           # 도메인별 기능
│   │   ├── products/       # 상품 CRUD + Like
│   │   ├── articles/       # 게시글 CRUD + Like
│   │   ├── comments/       # 댓글 CRUD
│   │   ├── users/          # 회원가입/로그인
│   │   └── upload/         # 이미지 업로드
│   ├── shared/
│   │   ├── config/         # 환경변수 설정
│   │   ├── database/       # Prisma client
│   │   ├── middlewares/    # 인증, 에러처리
│   │   └── types/          # 공통 타입
│   ├── app.ts              # Express 앱 설정
│   └── server.ts           # HTTP 서버
├── prisma/
│   ├── schema.prisma       # 데이터베이스 스키마
│   └── seed.ts             # 초기 데이터
└── public/uploads/         # 업로드된 파일
```

## 🚀 시작하기

### 1. 환경변수 설정

`.env` 파일 생성:

```env
PORT=9999
DB_HOST=localhost
DB_PORT=5432
DB_NAME=panda_market
DB_USER=panda_user
DB_PASSWORD=panda1234
DATABASE_URL=postgresql://panda_user:panda1234@localhost:5432/panda_market
CORS_ORIGIN=*
JWT_SECRET=your-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production
NODE_ENV=development
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 데이터베이스 설정

```bash
# Prisma Client 생성
npm run generate

# 데이터베이스 스키마 적용
npx prisma db push

# 초기 데이터 삽입
npm run seed
```

### 4. 서버 실행

```bash
# 개발 모드
npm run dev

# 프로덕션 빌드
npm run build
npm start
```

## 📡 API 엔드포인트

### 인증
- `POST /api/users/register` - 회원가입
- `POST /api/users/login` - 로그인
- `POST /api/users/refresh` - 토큰 갱신
- `GET /api/users/me` - 내 정보 조회 (인증 필요)
- `PATCH /api/users/me` - 내 정보 수정 (인증 필요)

### 상품
- `GET /api/products` - 상품 목록 (페이지네이션, 필터링)
- `GET /api/products/:id` - 상품 상세
- `POST /api/products` - 상품 생성 (인증 필요)
- `PATCH /api/products/:id` - 상품 수정 (인증 필요)
- `DELETE /api/products/:id` - 상품 삭제 (인증 필요)
- `POST /api/products/:id/like` - 좋아요 토글 (인증 필요)

### 게시글
- `GET /api/articles` - 게시글 목록
- `GET /api/articles/:id` - 게시글 상세
- `POST /api/articles` - 게시글 생성 (인증 필요)
- `PATCH /api/articles/:id` - 게시글 수정 (인증 필요)
- `DELETE /api/articles/:id` - 게시글 삭제 (인증 필요)
- `POST /api/articles/:id/like` - 좋아요 토글 (인증 필요)

### 댓글
- `GET /api/comments?productId=1` - 상품 댓글 목록
- `GET /api/comments?articleId=1` - 게시글 댓글 목록
- `POST /api/comments` - 댓글 생성 (인증 필요)
- `PATCH /api/comments/:id` - 댓글 수정 (인증 필요)
- `DELETE /api/comments/:id` - 댓글 삭제 (인증 필요)

### 업로드
- `POST /api/upload` - 이미지 업로드 (form-data)

## 🔧 개발 스크립트

```bash
npm run dev          # 개발 서버 (ts-node)
npm run build        # TypeScript 빌드
npm start            # 프로덕션 서버
npm run generate     # Prisma Client 생성
npm run seed         # 데이터베이스 시드
npm test             # 테스트 실행
```

## 📦 주요 의존성

- **express** - 웹 프레임워크
- **@prisma/client** - Prisma ORM
- **jsonwebtoken** - JWT 인증
- **bcryptjs** - 비밀번호 해싱
- **multer** - 파일 업로드
- **zod** - 스키마 검증
- **cors** - CORS 설정

## 🎯 코딩 규칙

1. **No `any` type** - 모든 타입 명시
2. **Type Redefinition 제거** - Prisma 타입 재사용
3. **Single Source of Truth** - 타입 중복 정의 금지
4. **Single Responsibility** - 각 파일은 단일 책임

## 📝 참고 파일

- `schema.sql` - 원본 SQL 스키마 (참고용)
- `queries.sql` - 원본 SQL 쿼리 (참고용)

Prisma가 데이터베이스 스키마를 관리하므로 이 파일들은 참조 목적으로만 보관됩니다.
