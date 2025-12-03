# Sprint Mission 4: 인증 기능을 갖춘 API 서버

Node.js, Express, Prisma를 사용하여 JWT 기반 인증(Access/Refresh Token)과 인가(Authorization) 로직을 갖춘 RESTful API 서버를 구현합니다.

---

## 기술 스택

- **Runtime Environment**: Node.js
- **Web Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JSON Web Token (JWT)
- **Password Hashing**: bcrypt
- **Development Tool**: nodemon
.
---

## 프로젝트 아키텍처

이 프로젝트는 기능별로 코드를 분리하여 유지보수성과 가독성을 높이는 것을 목표로 설계되었습니다. `src` 폴더는 애플리케이션의 핵심 소스 코드를 담는 역할을 합니다.

- `src/routes`: API의 주소(`/api/...`)를 정의하고, 들어온 요청을 어떤 로직이 처리해야 할지 안내합니다. 기능별로 (`users.router.js`, `products.router.js` 등) 파일을 분리하여 관리합니다.

- `src/middlewares`: API 로직이 실행되기 전/후에 공통적으로 처리해야 할 작업들을 정의합니다. 예를 들어, `auth.middleware.js`는 로그인이 필수인 API의 검문소 역할을, `optional-auth.middleware.js`는 로그인은 선택이지만 했을 때 추가 정보를 제공하는 유연한 안내원 역할을 합니다.

- `src/utils`: 프로젝트 여러 곳에서 공통적으로 사용될 수 있는 작은 기능이나 도구들을 모아둡니다. `prisma.util.js`는 데이터베이스 연결이라는 공구를 하나만 만들어두고 여러 곳에서 가져다 쓸 수 있게 합니다.

- `prisma`: Prisma 스키마(`schema.prisma`)와 데이터베이스 버전 관리 파일(migrations)을 관리합니다.

---

## 핵심 기능 구현 설명

### 1. 인증 (Authentication)

본 서버는 Stateless한 환경에서 안전한 인증을 구현하기 위해 **Access Token**과 **Refresh Token**을 함께 사용하는 방식을 채택했습니다.

- **비밀번호 해싱**: `bcrypt` 라이브러리를 사용하여 사용자의 비밀번호를 복잡한 해시값으로 변환하여 DB에 저장합니다. 이를 통해 DB가 유출되더라도 실제 비밀번호는 안전하게 보호됩니다.

- **토큰 기반 로그인 흐름**:
  1.  **로그인**: 사용자가 올바른 이메일과 비밀번호로 로그인을 요청하면, 서버는 **Access Token (단기 이용권, 예: 12시간)**과 **Refresh Token (장기 이용권, 예: 7일)**을 함께 발급합니다.
  2.  **Refresh Token 저장**: 서버는 발급한 Refresh Token을 데이터베이스의 `User` 테이블에 저장하여, 특정 사용자의 로그인 세션을 관리하고 필요시 무효화할 수 있도록 합니다.
  3.  **API 요청**: 사용자는 이후 API를 요청할 때 Access Token을 `Authorization` 헤더에 담아 보냅니다. `authMiddleware`는 이 토큰의 유효성을 검사하여 사용자를 인증합니다.
  4.  **토큰 재발급**: Access Token이 만료되면, 사용자는 Refresh Token을 사용하여 `/api/token/refresh` API를 통해 새로운 Access Token을 재발급받습니다. 이 과정 덕분에 사용자는 비밀번호를 다시 입력하는 불편함 없이 로그인 상태를 유지할 수 있습니다.

### 2. 인가 (Authorization)

단순히 로그인 여부를 확인하는 것을 넘어, 특정 작업을 수행할 '권한'이 있는지를 확인합니다.

- **소유권 확인**: 상품, 게시글, 댓글 등을 수정하거나 삭제할 때, 해당 데이터의 `authorId`와 현재 로그인한 사용자(`req.user.id`)의 ID를 비교합니다. 일치하지 않을 경우, `403 Forbidden` 에러를 반환하여 다른 사람의 데이터를 수정/삭제하는 것을 방지합니다.

---

## API 명세

(모든 요청의 기본 경로는 `/api` 입니다.)

### Users & Auth

| 기능 | HTTP Method | URL | 인증 필요 | 요청 Body | 응답 | 
| --- | --- | --- | --- | --- | --- |
| 회원가입 | `POST` | `/signup` | ❌ | `email`, `password`, `confirmPassword`, `nickname` | `id`, `email`, `nickname`, `createdAt` |
| 로그인 | `POST` | `/login` | ❌ | `email`, `password` | `accessToken`, `refreshToken` |
| 토큰 재발급 | `POST` | `/token/refresh` | ✅ (Refresh) | (없음) | `accessToken` |
| 내 정보 조회 | `GET` | `/users/me` | ✅ | (없음) | `id`, `email`, `nickname`, ... |
| 내 정보 수정 | `PUT` | `/users/me` | ✅ | `nickname?`, `image?` | 수정된 사용자 정보 |
| 비밀번호 변경 | `PUT` | `/users/me/password` | ✅ | `currentPassword`, `newPassword`, `confirmNewPassword` | 성공 메시지 |
| 내가 쓴 상품 목록 | `GET` | `/users/me/products` | ✅ | (없음) | 상품 목록 |
| 내가 좋아요한 상품 | `GET` | `/users/me/liked-products` | ✅ | (없음) | 상품 목록 |

### Products

| 기능 | HTTP Method | URL | 인증 필요 | 요청 Body | 응답 |
| --- | --- | --- | --- | --- | --- |
| 상품 등록 | `POST` | `/products` | ✅ | `name`, `content` | 생성된 상품 정보 |
| 상품 목록 조회 | `GET` | `/products` | ❌ | (없음) | 전체 상품 목록 |
| 상품 상세 조회 | `GET` | `/products/:productId` | (선택) | (없음) | `isLiked` 포함된 상품 정보 |
| 상품 수정 | `PUT` | `/products/:productId` | ✅ | `name?`, `content?` | 수정된 상품 정보 |
| 상품 삭제 | `DELETE` | `/products/:productId` | ✅ | (없음) | 성공 메시지 |
| 상품 좋아요/취소 | `POST` | `/products/:productId/like` | ✅ | (없음) | 성공 메시지 |

(게시글 및 댓글 API 명세는 위와 유사하여 생략)

---

## 설치 및 실행 방법

1.  **리포지토리 클론**
    ```bash
    git clone <repository-url>
    cd <repository-name>/mission-4
    ```

2.  **NPM 패키지 설치**
    ```bash
    npm install
    ```

3.  **데이터베이스 설정**
    - 로컬 환경에 PostgreSQL을 설치하고 실행합니다.
    - `psql` 등을 통해 접속하여 새 데이터베이스를 생성합니다. (예: `CREATE DATABASE mission4;`)

4.  **.env 파일 설정**
    - `mission-4` 폴더 최상단에 `.env` 파일을 생성합니다.
    - 아래 내용을 파일에 추가하고, 본인의 데이터베이스 정보에 맞게 수정합니다.
      ```env
      DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DB_NAME?schema=public"
      ```

5.  **데이터베이스 마이그레이션**
    - Prisma 스키마를 데이터베이스에 적용하여 테이블을 생성합니다.
    ```bash
    npx prisma migrate dev
    ```

6.  **서버 실행**
    ```bash
    npm run dev
    ```

7.  서버가 `http://localhost:3000` 에서 정상적으로 실행되는 것을 확인합니다.
