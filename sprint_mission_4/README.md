# Sprint Mission 4 - E-commerce API Server

코드리뷰 피드백을 반영하여 개선된 E-commerce API 서버입니다.

## 📋 프로젝트 개요

상품과 게시글을 관리하는 RESTful API 서버로, 사용자 인증, 좋아요, 댓글 기능을 포함합니다.

## 🛠 기술 스택

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **File Upload**: Multer

## 🔧 주요 개선사항

### 1. JWT Secret 전역 관리
**문제점**: JWT Secret이 각 파일에서 개별적으로 `process.env`를 통해 접근
**해결책**: 전역 상수로 관리하여 재사용성 향상

```typescript
// src/config/constants.ts
export const JWT_SECRET = process.env.JWT_SECRET!;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
```

### 2. 타입 안전성 개선
**문제점**: `any` 타입 사용으로 인한 타입 안전성 부족
**해결책**: 적절한 인터페이스 정의 및 타입 체크 강화

```typescript
// src/types/auth.ts
export interface JWTPayload {
  userId: number;
  iat?: number;
  exp?: number;
}

// src/types/article.ts
export interface ArticleWithLikeStatus {
  id: number;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
}
```

### 3. N+1 쿼리 문제 해결
**문제점**: 좋아요 상태 확인 시 각 상품/게시글마다 개별 쿼리 실행
**해결책**: 배치 쿼리로 최적화

**Before:**
```typescript
const productsWithLikeStatus = await Promise.all(
  products.map(async (product) => {
    const isLiked = await prisma.like.findFirst({
      where: { userId: req.user.id, productId: product.id }
    });
    // ...
  })
);
```

**After:**
```typescript
const userLikes = req.user
  ? await prisma.like.findMany({
      where: {
        userId: req.user.id,
        productId: { in: products.map(p => p.id) }
      }
    })
  : [];

const likedProductIds = new Set(userLikes.map(like => like.productId));
```

### 4. 가격 오버플로우 검증
**문제점**: PostgreSQL Integer 범위를 초과하는 가격 값에 대한 검증 부재
**해결책**: 최대값 검증 추가

```typescript
const MAX_POSTGRES_INT = 2147483647;

if (price > MAX_POSTGRES_INT) {
  res.status(400).json({ error: 'Price exceeds maximum allowed value' });
  return;
}
```

## 📁 프로젝트 구조

```
backend/
├── src/
│   ├── config/
│   │   └── constants.ts          # JWT 상수 관리
│   ├── controllers/
│   │   ├── article.controller.ts # 게시글 컨트롤러
│   │   ├── product.controller.ts # 상품 컨트롤러
│   │   └── user.controller.ts    # 사용자 컨트롤러
│   ├── middlewares/
│   │   ├── auth.ts              # 인증 미들웨어
│   │   └── validation.ts        # 유효성 검사
│   ├── types/
│   │   ├── auth.ts              # 인증 타입 정의
│   │   ├── article.ts           # 게시글 타입 정의
│   │   └── product.ts           # 상품 타입 정의
│   └── main.ts
└── prisma/
    └── schema.prisma
```

## 🚀 설치 및 실행

### 1. 의존성 설치
```bash
cd sprint_mission_4/backend
npm install
```

### 2. 환경변수 설정
```bash
# .env 파일 생성
DATABASE_URL="your_database_url"
JWT_SECRET="your_jwt_secret"
JWT_REFRESH_SECRET="your_jwt_refresh_secret"
```

### 3. 데이터베이스 설정
```bash
npm run generate
npm run deploy
npm run seed
```

### 4. 개발 서버 실행
```bash
npm run dev
```

### 5. 빌드 및 배포
```bash
npm run build
npm start
```

## 📝 스크립트 명령어

- `npm run dev`: 개발 서버 실행
- `npm run build`: TypeScript 컴파일
- `npm run start`: 프로덕션 서버 실행
- `npm run lint`: ESLint 실행
- `npm run typecheck`: 타입 체크
- `npm run format`: Prettier 포맷팅

## 🔍 성능 최적화

### 데이터베이스 쿼리 최적화
- N+1 문제 해결로 쿼리 수를 O(n)에서 O(1)로 감소
- 상품 목록 10개 조회 시: 11번 쿼리 → 2번 쿼리

### 타입 안전성
- `any` 타입 제거로 컴파일 타임 에러 감지 향상
- 런타임 오류 가능성 감소

### 메모리 최적화
- Set을 활용한 O(1) 검색으로 성능 향상
- 불필요한 Promise.all 제거

## 🔒 보안 개선사항

### JWT 토큰 관리
- 토큰 시크릿 중앙화 관리
- 타입 안전한 JWT 페이로드 처리

### 입력 검증 강화
- PostgreSQL 정수 범위 검증
- 가격 오버플로우 방지

## 📊 코드 품질 지표

- TypeScript strict 모드 활용
- ESLint + Prettier 설정
- 타입 커버리지 개선
- 코드 재사용성 향상

## 🤝 기여 가이드

1. 타입 안전성을 최우선으로 고려
2. 데이터베이스 쿼리 최적화 검토
3. 보안 검증 강화
4. 코드 리뷰 피드백 적극 반영

## 📄 라이선스

ISC

---

**개발자**: F-los
**리뷰어**: mag123c
**프로젝트 기간**: 2024년 스프린트 미션 4