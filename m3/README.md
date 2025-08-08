
### Sprint mission 3rd

#### 📖 프로젝트 소개 (Project Introduction)

Express.js와 Prisma를 사용하여 중고마켓, 게시판, 그리고 파일 업로드 기능을 구현했습니다.
<br>
데이터베이스는 **PostgreSQL**을 사용했으며, **Render**에 배포되었습니다.

#### 🔗 참고 자료 (References)

1.  **스프린트 미션 3 요구사항:**
      * [노션 페이지](https://www.notion.so/3-246fb000b61480f58bb5d4b08d0d6c5f?source=copy_link)
      * 이 링크에서 프로젝트의 상세 요구사항과 목표를 확인할 수 있습니다.

-----

### 📋 API 문서 (API Documentation)

#### 기본 URL (Base URL)

`https://node-4th-sprint-m3.onrender.com`

"지금 서버는 딥 슬립😴 중입니다! 첫 요청에는 깨어나는 데 시간이 조금 걸릴 수 있으니, 따뜻한 마음으로 잠시 기다려주세요."

-----

#### 1\. 게시글 (`Articles`) 및 댓글 API

게시글 및 게시글에 대한 댓글을 관리하는 API입니다.

| HTTP 메서드 | 엔드포인트                      | 설명                               |
| :---------- | :------------------------------ | :--------------------------------- |
| `POST`      | `/articles`                     | 새 게시글을 생성합니다.            |
| `GET`       | `/articles`                     | 모든 게시글 목록을 조회합니다.     |
| `GET`       | `/articles/:articleId`          | 특정 게시글을 조회합니다.          |
| `PATCH`     | `/articles/:articleId`          | 특정 게시글을 수정합니다.          |
| `DELETE`    | `/articles/:articleId`          | 특정 게시글을 삭제합니다.          |
| `POST`      | `/articles/:articleId/comments` | 특정 게시글에 새 댓글을 추가합니다. |
| `GET`       | `/articles/:articleId/comments` | 특정 게시글의 모든 댓글을 조회합니다. |

**`GET /articles` 요청 파라미터**

게시글 목록 조회 시 사용할 수 있는 쿼리 파라미터입니다.

| 파라미터 | 타입     | 필수 여부 | 설명                                                                      |
| :------- | :------- | :-------- | :------------------------------------------------------------------------ |
| `offset` | `number` | 선택      | 조회 시작 위치 (기본값: `0`)                                                |
| `limit`  | `number` | 선택      | 한 번에 조회할 게시글 수 (기본값: `5`)                                    |
| `order`  | `string` | 선택      | 정렬 순서 (`"asc"`: 오름차순, `"recent"`: 최신순. 기본값: `"asc"`)      |
| `search` | `string` | 선택      | 제목 또는 내용에 포함된 검색어 (대소문자 구분 없음)                       |

**`POST /articles` 요청 본문**

새 게시글 생성 시 전송할 요청 본문입니다.

| 필드    | 타입     | 필수 여부 | 설명           |
| :------ | :------- | :-------- | :------------- |
| `title` | `string` | 필수      | 게시글 제목    |
| `content` | `string` | 필수      | 게시글 내용    |

**`PATCH /articles/:articleId` 요청 본문**

특정 게시글 수정 시 전송할 요청 본문입니다.

| 필드    | 타입     | 필수 여부 | 설명           |
| :------ | :------- | :-------- | :------------- |
| `title` | `string` | 선택      | 수정할 게시글 제목 |
| `content` | `string` | 선택      | 수정할 게시글 내용 |

-----

#### 2\. 상품 (`Products`) 및 댓글 API

상품 및 상품에 대한 댓글을 관리하는 API입니다.

| HTTP 메서드 | 엔드포인트                      | 설명                               |
| :---------- | :------------------------------ | :--------------------------------- |
| `POST`      | `/products`                     | 새 상품을 생성합니다.              |
| `GET`       | `/products`                     | 모든 상품 목록을 조회합니다.       |
| `GET`       | `/products/:productId`          | 특정 상품을 조회합니다.            |
| `PATCH`     | `/products/:productId`          | 특정 상품을 수정합니다.            |
| `DELETE`    | `/products/:productId`          | 특정 상품을 삭제합니다.            |
| `POST`      | `/products/:productId/comments` | 특정 상품에 새 댓글을 추가합니다.  |
| `GET`       | `/products/:productId/comments` | 특정 상품의 모든 댓글을 조회합니다. |

**`GET /products` 요청 파라미터**

상품 목록 조회 시 사용할 수 있는 쿼리 파라미터입니다.

| 파라미터 | 타입     | 필수 여부 | 설명                                                                      |
| :------- | :------- | :-------- | :------------------------------------------------------------------------ |
| `offset` | `number` | 선택      | 조회 시작 위치 (기본값: `0`)                                                |
| `limit`  | `number` | 선택      | 한 번에 조회할 상품 수 (기본값: `5`)                                        |
| `order`  | `string` | 선택      | 정렬 순서 (`"asc"`: 오름차순, `"recent"`: 최신순. 기본값: `"asc"`)      |
| `search` | `string` | 선택      | 이름 또는 설명에 포함된 검색어 (대소문자 구분 없음)                       |

**`POST /products` 요청 본문**

새 상품 생성 시 전송할 요청 본문입니다.

| 필드        | 타입     | 필수 여부 | 설명           |
| :---------- | :------- | :-------- | :------------- |
| `name`      | `string` | 필수      | 상품 이름      |
| `description` | `string` | 필수      | 상품 설명      |
| `price`     | `number` | 필수      | 상품 가격      |

-----

#### 3\. 댓글 (`Comments`) 공통 API

모든 댓글에 대한 범용적인 관리 API입니다.

| HTTP 메서드 | 엔드포인트              | 설명                 |
| :---------- | :---------------------- | :------------------- |
| `PATCH`     | `/comments/:commentId`  | 특정 댓글을 수정합니다. |
| `DELETE`    | `/comments/:commentId`  | 특정 댓글을 삭제합니다. |

**`PATCH /comments/:commentId` 요청 본문**

특정 댓글 수정 시 전송할 요청 본문입니다.

| 필드    | 타입     | 필수 여부 | 설명                 |
| :------ | :------- | :-------- | :------------------- |
| `content` | `string` | 선택      | 수정할 댓글 내용     |

-----

#### 4\. 파일 (`Files`) 및 파일 업로드 (`Uploads`) API

파일 업로드와 다운로드를 위한 API입니다.

| HTTP 메서드 | 엔드포인트            | 설명                           |
| :---------- | :-------------------- | :----------------------------- |
| `POST`      | `/uploads`              | 파일 1개를 업로드합니다.       |
| `GET`       | `/files/:filename`      | 특정 파일을 조회합니다. |

**`POST /uploads` 요청 본문**

파일 업로드 시 전송할 요청 본문입니다. `Content-Type: multipart/form-data` 형식을 사용해야 합니다.

| 필드        | 타입 | 필수 여부 | 설명                                   |
| :---------- | :--- | :-------- | :------------------------------------- |
| `attachment` | `file` | 필수      | 업로드할 파일 (단일 파일)              |

**`GET /files/:filename` 요청 파라미터**

특정 파일 조회 시 사용할 수 있는 경로 파라미터입니다.

| 파라미터 | 타입     | 필수 여부 | 설명                               |
| :------- | :------- | :-------- | :--------------------------------- |
| `filename` | `string` | 필수      | 조회할 파일의 고유 이름 (업로드 응답 값) |

-----

#### 5\. API 요청 예시 (API Request Examples)

**5-1. 파일 업로드 (`POST /uploads`)**

`Content-Type: multipart/form-data` 형식으로 파일을 업로드하는 예시입니다.

```bash
# curl 명령어 사용 예시
curl -X POST \
  -F "attachment=@/경로/image.jpg" \
  https://node-4th-sprint-m3.onrender.com/uploads
```

  * `curl` 명령어의 `-F` 옵션은 `form-data`를 지정하며, `attachment`는 서버에서 파일을 받을 때 사용하는 필드 이름입니다.
  * `@` 뒤에 업로드할 파일의 로컬 경로를 정확히 지정해야 합니다.

**5-2. 특정 파일 조회 (`GET /files/:filename`)**

`GET` 요청으로 특정 파일을 조회하는 예시입니다. `filename`은 파일 업로드 시 응답으로 받은 값입니다.

```
GET https://node-4th-sprint-m3.onrender.com/files/461c1284e50e7b009a40a324c9e41e76.jpg
```

-----

### 프로젝트 폴더 및 파일 구조

```
./M3
├── docs/                      # 프로젝트 문서 (.ignore)
├── http/                      # REST Client 테스트 파일 (.ignore)
├── node_modules/
├── prisma/                    # Prisma ORM 관련 파일
│   ├── migrations/            # DB 마이그레이션 파일
│   ├── schema.prisma          # 데이터베이스 스키마 정의
│   ├── seed.js                # 초기 데이터 시딩 스크립트
│   └── mock-data.js           # 초기 Mock 데이터
│   
├── src/
│   ├── services/              # 비즈니스 로직 레이어
│   │   ├── articleService.js
│   │   ├── productService.js
│   │   ├── commentService.js
│   │   └── uploadService.js
│   │
│   ├── middlewares/           # Express.js 미들웨어
│   │   ├── always.js          # 전역 미들웨어 (요청 로깅)
│   │   ├── asyncHandler.js    # 비동기 에러 핸들러
│   │   ├── multer.js          # 파일 업로드 설정 (multer)
│   │   └── validateId.js      # ID 유효성 검증 미들웨어
│   │
│   ├── routes/                # 라우터 모듈 (Express.Router)
│   │   ├── articles.js        # 자유게시판 라우트
│   │   ├── comments.js        # 댓글 라우트
│   │   ├── uploads.js         # 파일 업로드 라우트
│   │   └── products.js        # 중고마켓 라우트
│   │
│   ├── validators/            # 유효성 검증 스키마
│   │   └── structs.js         # Superstruct 스키마
│   │
│   └── app.js                 # 메인 서버 파일 (애플리케이션 진입점)
│
├── uploads/                   # 업로드 파일 저장 디렉토리 (.ignore)
├── .env                       # 환경 변수 파일 (.ignore)
├── .gitignore                 # Git 관리 제외 파일
├── package-lock.json          # 패키지 의존성 파일
├── package.json
└── README.md
```