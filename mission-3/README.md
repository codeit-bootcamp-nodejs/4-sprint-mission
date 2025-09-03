# Sprint 3 Mission - 중고마켓 & 게시판 API 서버

## 🚀 프로젝트 소개

이 프로젝트는 Express.js, Prisma ORM, 그리고 PostgreSQL을 사용하여 중고마켓과 자유게시판의 핵심 기능을 갖춘 RESTful API 서버를 구축합니다. 요구사항에 따라 데이터 모델링, API 구현, 유효성 검사, 에러 처리, 페이지네이션, 그리고 이미지 업로드 기능까지 포함하고 있습니다.

## 주요 기능

### 공통
- **데이터베이스:** PostgreSQL 및 Prisma ORM을 활용한 데이터 관리
- **데이터 시딩:** `prisma/seed.js`를 통한 초기 데이터 설정
- **전역 에러 핸들링:** 모든 API 요청에 대한 일관된 에러 처리 및 적절한 HTTP 상태 코드 반환
- **비동기 에러 처리:** `asyncHandler` 미들웨어를 통한 `try...catch` 중복 제거

### 중고마켓 (Product)
- **스키마:** `id`, `name`, `description`, `price`, `tags`, `createdAt`, `updatedAt`
- **API:** 상품 등록, 목록 조회, 상세 조회, 수정, 삭제 (CRUD)
- **기능:** Offset 기반 페이지네이션, 최신순 정렬, 이름/설명 검색

### 자유게시판 (Article)
- **스키마:** `id`, `title`, `content`, `createdAt`, `updatedAt`
- **API:** 게시글 등록, 목록 조회, 상세 조회, 수정, 삭제 (CRUD)
- **기능:** Offset 기반 페이지네이션, 최신순 정렬, 제목/내용 검색

### 댓글 (ProductComment, ArticleComment)
- **API:** 각 상품 및 게시글에 대한 댓글 등록, 수정, 삭제, 목록 조회 (CRUD)
- **기능:** Cursor 기반 페이지네이션 (댓글 목록 조회)

### 유효성 검증
- 상품 및 게시물 등록/수정 시 필수 필드 검증 미들웨어 구현

### 이미지 업로드
- `multer` 미들웨어를 사용한 이미지 업로드 API 구현
- 업로드된 이미지는 서버의 `uploads/` 디렉토리에 저장 및 정적 파일 제공

### 코드 구조
- `express.Router()`를 이용한 라우트 모듈 분리
- `router.route()`를 활용한 중복 경로 통합 리팩토링

## 🛠️ 기술 스택

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Middleware:** `cors`, `dotenv`, `multer`
- **Deployment:** Render.com

##  로컬에서 실행하기

1.  **저장소 클론:**
    ```bash
    git clone [당신의 GitHub 저장소 URL]
    cd 4-sprint-mission
    ```
2.  **의존성 설치:**
    ```bash
    npm install
    ```
3.  **환경 변수 설정:**
    프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가합니다.
    ```env
    DATABASE_URL="postgresql://[user]:[password]@[host]:[port]/[database]?schema=public"
    PORT=3000
    ```
    (로컬 PostgreSQL 설정에 맞게 `DATABASE_URL`을 변경해주세요.)
4.  **Prisma 스키마 적용 및 데이터 시딩:**
    ```bash
    npx prisma migrate dev --name initial_migration
    npx prisma db seed
    ```
5.  **애플리케이션 실행:**
    ```bash
    npm start
    ```
    서버가 `http://localhost:3000`에서 실행됩니다.

## 🌐 배포 정보

이 프로젝트는 Render.com을 통해 배포되었습니다.

- **배포된 API URL:** [https://four-sprint-mission-c8ai.onrender.com](https://four-sprint-mission-c8ai.onrender.com)

## 📝 API 엔드포인트 요약

### 상품 (Products)
- `POST /api/products`: 상품 등록
- `GET /api/products`: 상품 목록 조회 (페이지네이션, 검색, 정렬)
- `GET /api/products/:productId`: 상품 상세 조회
- `PATCH /api/products/:productId`: 상품 수정
- `DELETE /api/products/:productId`: 상품 삭제

### 게시글 (Articles)
- `POST /api/articles`: 게시글 등록
- `GET /api/articles`: 게시글 목록 조회 (페이지네이션, 검색, 정렬)
- `GET /api/articles/:articleId`: 게시글 상세 조회
- `PATCH /api/articles/:articleId`: 게시글 수정
- `DELETE /api/articles/:articleId`: 게시글 삭제

### 댓글 (Comments)
- `POST /api/products/:productId/comments`: 상품 댓글 등록
- `GET /api/products/:productId/comments`: 상품 댓글 목록 조회 (커서 페이지네이션)
- `PATCH /api/products/:productId/comments/:commentId`: 상품 댓글 수정
- `DELETE /api/products/:productId/comments/:commentId`: 상품 댓글 삭제
- `POST /api/articles/:articleId/comments`: 게시글 댓글 등록
- `GET /api/articles/:articleId/comments`: 게시글 댓글 목록 조회 (커서 페이지네이션)
- `PATCH /api/articles/:articleId/comments/:commentId`: 게시글 댓글 수정
- `DELETE /api/articles/:articleId/comments/:commentId`: 게시글 댓글 삭제

### 이미지 업로드
- `POST /api/uploads`: 이미지 업로드 (form-data, `image` 필드 사용)
  - 응답으로 이미지 URL 반환 (`/uploads/파일명.jpg`)
  - 업로드된 이미지는 `https://four-sprint-mission-c8ai.onrender.com/uploads/파일명.jpg` 로 직접 접근 가능

---
