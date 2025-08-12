
# Sprint 3 Mission - 중고마켓 & 게시판 API 서버

이 파일은 Gemini가 현재 프로젝트의 진행 상황을 기억하고 다음 세션에서 원활하게 작업을 이어가기 위해 작성되었습니다.

---

### 1. 프로젝트 목표

Express와 Prisma, PostgreSQL을 사용하여 중고마켓과 자유게시판의 핵심 기능을 갖춘 REST API 서버를 구축합니다. 요구사항에 따라 데이터 모델링, API 구현, 유효성 검사, 에러 처리, 페이지네이션, 이미지 업로드 기능 등을 포함합니다.

---

### 2. 주요 요구사항 요약

- **공통:** PostgreSQL, Prisma ORM, 데이터 시딩, 전역 에러 핸들러, 적절한 상태 코드 반환
- **중고마켓 (Product):**
  - 스키마: `id`, `name`, `description`, `price`, `tags`, `createdAt`, `updatedAt`
  - API: 상품 등록, 목록 조회, 상세 조회, 수정, 삭제
  - 기능: Offset 기반 페이지네이션, 최신순 정렬, 이름/설명 검색
- **자유게시판 (Article):**
  - 스키마: `id`, `title`, `content`, `createdAt`, `updatedAt`
  - API: 게시글 등록, 목록 조회, 상세 조회, 수정, 삭제
  - 기능: Offset 기반 페이지네이션, 최신순 정렬, 제목/내용 검색
- **댓글 (ProductComment, ArticleComment):**
  - 각 기능별 댓글 API (등록, 수정, 삭제, 목록 조회)
  - 기능: Cursor 기반 페이지네이션 (목록 조회)
- **유효성 검증:** 상품/게시물 등록 및 수정 시 필수 필드 검증 미들웨어 구현
- **이미지 업로드:** `multer`를 사용한 이미지 업로드 API 구현
- **코드 구조:** `express.Router()`로 라우트 분리, `app.route()`로 중복 경로 통합
- **배포:** `.env` 사용, CORS 설정, render.com 배포

---

### 3. 현재까지 진행 상황 (2025-08-06)

- **데이터베이스 및 스키마:**
  - `prisma/schema.prisma` 설정 완료 (PostgreSQL 연동).
  - `Product`, `Article`, `ProductComment`, `ArticleComment` 모델 정의 및 관계 설정 (`onDelete: Cascade`) 완료.
  - `prisma/seed.js`를 통한 기본 데이터 시딩 코드 작성 완료.

- **API 및 라우팅:**
  - `products.router.js`와 `articles.router.js`로 라우트 모듈 분리 완료.
  - **상품 및 게시글 관련 모든 CRUD API 구현 완료.**
  - **댓글 관련 모든 CRUD API 구현 완료.**
  - 페이지네이션(Offset, Cursor), 정렬, 검색 기능 모두 구현 완료.

- **미들웨어:**
  - **유효성 검증:**
    - `products.middleware.js`: 상품 데이터 유효성 검증 미들웨어 구현 및 적용 완료.
    - `articles.middleware.js`: 게시글 데이터 유효성 검증 미들웨어 구현 및 적용 완료.
  - **에러 처리:**
    - `error-handler.middleware.js`: 전역 에러 핸들러 미들웨어 생성 및 `app.js`에 등록 완료.
    - `async-handler.js`: 비동기 에러 처리를 위한 유틸리티 미들웨어 생성 완료.
    - `products.router.js`와 `articles.router.js`의 모든 라우트 핸들러에 `asyncHandler`를 적용하여 `try...catch` 구문을 제거하고 에러를 전역 핸들러로 위임하도록 리팩토링 완료.

- **이슈 및 해결:**
  - Postman 테스트 중 발생한 `PrismaClientValidationError`는 API 호출 시 URL에 `:productId`와 같은 파라미터 변수명을 그대로 사용한 것이 원인이었음. 실제 ID 값으로 변경하여 호출하는 것으로 문제 해결.
  - 이 과정에서 불필요하게 수정했던 라우터 코드는 원래 상태로 복원 완료.

---

### 4. 다음 진행 단계

1.  **이미지 업로드 API 구현:**
    - `multer` 미들웨어 설정 (`upload.middleware.js` 생성).
    - 이미지 파일을 `uploads/` 디렉토리에 저장.
    - 이미지 업로드를 위한 API 엔드포인트 생성 및 응답으로 파일 경로 반환.

2.  **라우트 중복 제거 (재검토):**
    - 현재는 `router.get`, `router.post` 등으로 분리되어 있음. 요구사항에 따라 `router.route()`를 사용하여 중복 경로를 통합하는 리팩토링 진행.

3.  **배포 준비:**
    - `cors` 설정 추가.
    - `.env` 파일에 배포 환경용 설정 추가.
    - `render.com`을 이용한 배포 준비.

---

### 5. 최종 제출 계획

- **저장소:** `4-sprint-mission` 폴더를 사용하여 제출.
- **브랜치 전략:** `본인이름` 브랜치에서 `본인이름-sprintN` 브랜치를 생성하여 작업.
- **제출 방식:** 작업 완료 후, 코드잇의 원본 저장소 `본인이름` 브랜치로 Pull Request(PR) 생성. (PR 제목: `[본인이름] sprintN`)
