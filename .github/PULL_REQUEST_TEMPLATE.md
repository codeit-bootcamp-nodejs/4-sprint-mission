## 요구사항

### 기본

- [x] PostgreSQL 설정
- [ ] Prisma 모델에 onDelete 설정

### 심화

- [ ] 심화 항목 1
- [ ] 심화 항목 2

## 주요 변경사항

-
-

## 스크린샷

![image](이미지url)

## 멘토에게

- 셀프 코드 리뷰를 통해 질문 이어가겠습니다.
-

PostgreSQL 설정
Prisma 모델에 onDelete 설정
데이터베이스 시딩 코드 작성
API별 에러 처리 구현
API별 상태 코드 반환
Product 모델 작성 (id, name, description, price, tags, createdAt, updatedAt)
상품 등록 API (POST /products)
상품 상세 조회 API (GET /products/:id)
상품 수정 API (PATCH /products/:id)
상품 삭제 API (DELETE /products/:id)
상품 목록 조회 API (GET /products)

- offset pagination
- 최신순 정렬
- name, description 검색
  상품 API 에러 처리 및 상태 코드
  Article 모델 작성 (id, title, content, createdAt, updatedAt)
  게시글 등록 API (POST /articles)
  게시글 상세 조회 API (GET /articles/:id)
  게시글 수정 API (PATCH /articles/:id)
  게시글 삭제 API (DELETE /articles/:id)
  게시글 목록 조회 API (GET /articles)
- offset pagination
- 최신순 정렬
- title, content 검색
  댓글 등록 API (POST) — 중고마켓, 자유게시판 각각 분리
  댓글 수정 API (PATCH)
  댓글 삭제 API (DELETE)
  댓글 목록 조회 API (GET) — cursor pagination, 중고마켓/자유게시판 분리
  상품 등록 유효성 검사 미들웨어
  게시글 등록 유효성 검사 미들웨어
  multer 미들웨어로 이미지 업로드 API 구현
  업로드 이미지 서버 저장 및 경로 반환
  에러 핸들러 미들웨어 구현 (400, 404, 500 등 상태 코드)
  app.route()로 중복 라우트 통합
  express.Router()로 중고마켓/자유게시판 라우트 분리
  .env 환경 변수 설정
  CORS 설정
  Render.com 배포
