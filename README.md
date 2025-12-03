# 🚀 UJU API 서버

11번째 스프린트 미션을 위해 제작된 API 서버입니다. 이 서버는 상품 및 게시글 관리를 위한 백엔드 서비스를 제공하며, 사용자 인증, 실시간 알림 등 다양한 기능을 포함하고 있습니다.

## ✨ 주요 기능

- **사용자 인증:** 상태 저장 리프레시 토큰(Stateful Refresh Tokens) 방식을 사용한 안전한 사용자 회원가입 및 로그인.
- **상품 및 게시글 관리:** 상품 및 게시글에 대한 CRUD(생성, 조회, 수정, 삭제) 기능.
- **댓글 및 좋아요:** 상품 및 게시글에 대한 댓글과 좋아요 기능.
- **이미지 업로드:** AWS S3를 연동하여 사용자 프로필, 상품, 게시글 이미지 업로드.
- **실시간 알림:** Socket.io를 사용하여 댓글 및 좋아요에 대한 실시간 알림 기능.
- **마이페이지:** 사용자가 등록한 상품, 좋아요 누른 상품 목록 조회.
- **주기적 작업:** Cron Job을 사용하여 더미 이미지 파일을 주기적으로 삭제.

## 🛠️ 사용 기술

- **백엔드:** Node.js, Express.js, TypeScript
- **데이터베이스:** PostgreSQL
- **ORM:** Prisma
- **인증:** Passport.js (JWT & Local Strategies)
- **테스트:** Vitest
- **유효성 검사:** Zod
- **이미지 처리:** AWS S3
- **실시간 통신:** Socket.io
- **환경 변수 관리:** Dotenv
- **코드 포맷팅:** Prettier
- **컨테이너:** Docker, Docker Compose

## 🚀 배포

이 서버는 AWS EC2에 배포되었으며, 아래 주소에서 API를 호출할 수 있습니다.

- **서버 주소:** `http://54.180.227.72`

`http/test.http` 파일의 `@host` 변수를 이 주소로 변경하여 배포된 서버를 테스트할 수 있습니다.

## 📂 프로젝트 구조

```
/
├── .env.sample          # 환경 변수 샘플 파일
├── .gitignore           # Git이 무시할 파일 및 폴더 목록
├── .prettierrc          # Prettier 설정 파일
├── package.json         # 프로젝트 메타데이터 및 스크립트
├── tsconfig.json        # TypeScript 설정 파일
├── vitest.config.ts     # Vitest 설정 파일
├── archive/             # 현재 사용하지 않는 코드 아카이브
├── coverage/            # 테스트 커버리지 보고서
├── dist/                # 컴파일된 JavaScript 파일 (빌드 결과)
├── erd/                 # ERD(개체-관계 다이어그램) 관련 파일 및 SQL 쿼리
├── http/                # REST Client 테스트 요청 파일 및 이미지 샘플
├── prisma/              # Prisma 스키마, 마이그레이션, 시드 파일
├── scripts/             # 유틸리티 스크립트 (예: WebSocket 테스트)
├── src/
│   ├── app.ts           # Express 애플리케이션 진입점
│   ├── server.ts        # 서버 시작 및 설정
│   ├── common/          # 공통 유효성 검사 및 유틸리티
│   ├── config/          # CORS, Cloudinary, S3 등 설정 파일
│   ├── lib/             # Prisma 클라이언트, Passport, Socket.io 등 라이브러리
│   ├── middlewares/     # Express 미들웨어 (에러 핸들링, 인증, 유효성 검사)
│   ├── modules/         # 기능별 모듈 (auth, users, products, articles 등)
│   │   ├── moduleName/
│   │   │   ├── *.container.ts    # 의존성 주입 컨테이너
│   │   │   ├── *.controller.ts   # 요청 핸들러
│   │   │   ├── *.dto.ts          # 데이터 전송 객체 (Zod 스키마)
│   │   │   ├── *.middleware.ts   # 모듈별 미들웨어
│   │   │   ├── *.repository.ts   # 데이터베이스 상호작용
│   │   │   ├── *.router.ts       # API 라우트 정의
│   │   │   └── *.service.ts      # 비즈니스 로직
│   ├── routes/          # 메인 라우터
│   ├── types/           # 타입 정의
│   └── utils/           # 유틸리티 함수 (asyncHandler, errorClass)
└── test/                # 단위 및 통합 테스트 파일
    ├── integration/     # 통합 테스트 파일
    └── unit/            # 단위 테스트 파일
```

## ⚙️ 시작하기

### 사전 요구 사항

- Node.js (v18 이상 권장)
- npm
- PostgreSQL 데이터베이스
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 설치 및 설정

1.  **저장소 클론:**

    ```bash
    git clone https://github.com/Park-DaSeul/4-sprint-mission.git
    cd 4-sprint-mission
    ```

2.  **의존성 설치:**

    ```bash
    npm install
    ```

3.  **환경 변수 설정:**
    `.env.sample` 파일을 복사하여 `.env` 파일을 생성하고, 아래 내용을 자신의 환경에 맞게 수정하세요.

    ```env
    # 서버 포트
    PORT=3000

    # CORS 설정
    CORS_ORIGIN=http://localhost:3000

    # 데이터베이스 URL
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

    # JWT 비밀 키
    JWT_ACCESS_TOKEN_SECRET="YOUR_ACCESS_TOKEN_SECRET"
    JWT_REFRESH_TOKEN_SECRET="YOUR_REFRESH_TOKEN_SECRET"

    # AWS S3 설정 (선택 사항)
    AWS_S3_BUCKET_NAME="YOUR_S3_BUCKET_NAME"
    AWS_S3_REGION="YOUR_S3_REGION"
    AWS_ACCESS_KEY_ID="YOUR_AWS_ACCESS_KEY"
    AWS_SECRET_ACCESS_KEY="YOUR_AWS_SECRET_KEY"
    ```

4.  **데이터베이스 마이그레이션:**

    ```bash
    npx prisma migrate deploy
    ```

5.  **(선택) 데이터베이스 시딩:**
    ```bash
    npx prisma db seed
    ```

### 실행

- **개발 모드:**
  ```bash
  npm run dev
  ```
- **프로덕션 모드:**
  ```bash
  npm run build
  npm run start
  ```

서버는 `.env` 파일에 지정된 포트(기본값: 3000)에서 시작됩니다.

## ✅ 테스트

이 프로젝트는 `vitest`를 사용하여 단위(Unit) 테스트와 통합(Integration) 테스트를 모두 지원합니다.

### 테스트 환경 설정

테스트를 실행하기 전에, 테스트용 데이터베이스를 설정해야 합니다.

1.  `.env.test` 파일을 생성하고 테스트용 데이터베이스 URL을 설정합니다.
    ```env
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/TEST_DATABASE?schema=public"
    ```
2.  아래 명령어를 실행하여 테스트 데이터베이스를 마이그레이션하고 Prisma 클라이언트를 생성합니다.
    ```bash
    npm run test:setup
    ```

### 테스트 실행

- **모든 테스트 실행:**
  ```bash
  npm test
  ```
- **단위 테스트만 실행:**
  ```bash
  npm run test:unit
  ```
- **통합 테스트만 실행:**
  ```bash
  npm run test:integration
  ```
- **특정 통합 테스트 파일 실행 (예: `auth`):**
  ```bash
  npm run test:integration:auth
  ```

## 📝 API 엔드포인트

### REST API (HTTP)

VS Code의 REST Client 확장 프로그램을 사용하면 `http/test.http` 파일로 모든 API를 간편하게 테스트할 수 있습니다.

1.  VS Code에서 `REST Client` 확장 프로그램을 설치합니다.
2.  `http/test.http` 파일을 엽니다.
3.  파일 상단의 `@host` 변수를 로컬(`http://localhost:3000`) 또는 배포 서버(`http://54.180.227.72`) 주소로 설정합니다.
4.  `@login` 요청을 먼저 보내 토큰을 발급받습니다. (REST Client가 자동으로 토큰을 변수에 저장합니다.)
5.  테스트하고 싶은 다른 API 요청 상단의 `Send Request` 버튼을 클릭하여 실행합니다.

### WebSocket API (실시간 알림)

`scripts/test.websocket.ts` 스크립트를 사용하여 실시간 알림 기능을 테스트할 수 있습니다.

1.  `scripts/test.websocket.ts` 파일의 `ACCESS_TOKEN` 변수에 유효한 사용자 액세스 토큰을 붙여넣습니다.
2.  터미널에서 아래 명령어를 실행합니다.
    ```bash
    npm run test:websocket
    ```
3.  이제 해당 사용자와 관련된 활동(예: 내 상품에 다른 사용자가 댓글 작성)이 발생하면, 스크립트를 실행한 터미널에 실시간으로 알림이 출력됩니다.

### 인증 (Auth)

- `POST /auth/signup`: 회원가입
- `POST /auth/login`: 로그인
- `POST /auth/logout`: 로그아웃
- `POST /auth/refresh`: 토큰 재발급

### 사용자 (Users)

- `GET /users/me`: 내 정보 조회
- `PUT /users/me`: 내 정보 수정
- `DELETE /users/me`: 회원 탈퇴
- `GET /users/me/products`: 내가 등록한 상품 조회
- `GET /users/me/likes`: 내가 좋아요 누른 상품 조회

### 이미지 (Images)

- `POST /images/upload`: 이미지 업로드 (사용자, 상품, 게시글 공통)

### 상품 (Products)

- `GET /products`: 상품 목록 조회
- `POST /products`: 상품 생성
- `GET /products/:id`: 상품 상세 조회
- `PUT /products/:id`: 상품 수정
- `DELETE /products/:id`: 상품 삭제

### 게시글 (Articles)

- `GET /articles`: 게시글 목록 조회
- `POST /articles`: 게시글 생성
- `GET /articles/:id`: 게시글 상세 조회
- `PUT /articles/:id`: 게시글 수정
- `DELETE /articles/:id`: 게시글 삭제

### 댓글 (Comments)

- `POST /products/:productId/comments`: 상품에 댓글 작성
- `POST /articles/:articleId/comments`: 게시글에 댓글 작성
- `PUT /productComments/:id` 또는 `PUT /articleComments/:id`: 댓글 수정
- `DELETE /productComments/:id` 또는 `DELETE /articleComments/:id`: 댓글 삭제

### 좋아요 (Likes)

- `POST /products/:productId/likes`: 상품 좋아요/취소
- `POST /articles/:articleId/likes`: 게시글 좋아요/취소

### 알림 (Notifications)

- `GET /notifications`: 내 알림 목록 조회
- `PATCH /notifications/:id/read`: 알림 읽음 처리
- `DELETE /notifications/read`: 읽은 알림 모두 삭제
