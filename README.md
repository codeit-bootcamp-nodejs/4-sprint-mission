# 토큰 기반 유저 인증/인가 API 시스템

Node.js, Express, TypeScript, Prisma를 사용한 JWT 기반 인증/인가 시스템입니다.

## 🚀 구현된 기능

### 기본 요구사항
- ✅ JWT Access Token 기반 인증
- ✅ 회원가입/로그인 API
- ✅ 비밀번호 해싱 (bcrypt)
- ✅ 상품/게시글/댓글 CRUD + 인가
- ✅ 유저 정보 관리

### 심화 요구사항  
- ✅ Refresh Token 구현
- ✅ 상품/게시글 좋아요 기능
- ✅ Prisma 관계형 데이터베이스
- ✅ isLiked 필드로 좋아요 상태 표시

## 🛠 기술 스택

- **언어**: TypeScript
- **프레임워크**: Node.js + Express
- **데이터베이스**: SQLite + Prisma ORM
- **인증**: JWT + bcrypt

서버: `http://localhost:3000`

## 📖 주요 API

### 인증
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/refresh` - 토큰 갱신
- `POST /api/auth/logout` - 로그아웃

### 유저
- `GET /api/users/me` - 내 정보 조회
- `PUT /api/users/me` - 내 정보 수정
- `PUT /api/users/me/password` - 비밀번호 변경

### 상품/게시글
- `GET /api/products` - 목록 조회
- `POST /api/products` - 등록 (인증 필요)
- `PUT /api/products/:id` - 수정 (작성자만)
- `DELETE /api/products/:id` - 삭제 (작성자만)
- `POST /api/products/:id/like` - 좋아요/취소

게시글 API(`/api/posts`)도 동일한 패턴으로 구현됨

## 🔐 인증/인가

- **Access Token**: 1시간, API 요청 인증용
- **Refresh Token**: 7일, 토큰 갱신용
- **권한**: 비인증(조회만) → 인증(CRUD) → 작성자(수정/삭제)

## 📁 프로젝트 구조

```
src/
├── types/          # TypeScript 타입 정의
├── controllers/    # API 컨트롤러
├── middleware/     # 인증 미들웨어  
├── routes/         # 라우터
├── utils/          # 유틸리티
└── app.ts         # 메인 애플리케이션
```