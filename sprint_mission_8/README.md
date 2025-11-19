# 판다마켓 실시간 알림 시스템

Express + Socket.IO를 사용한 실시간 알림 시스템 구현

## 실행 방법

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경변수 설정

```bash
cp .env.example .env
```

`.env` 파일 내용:
```env
# Server Configuration
PORT=3000

# CORS Configuration
CORS_ORIGIN=*

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=panda_market
DB_USER=panda_user
DB_PASSWORD=panda1234

# Node Environment
NODE_ENV=development
```

### 3. PostgreSQL 데이터베이스 설정

PostgreSQL에 접속:
```bash
psql -U postgres
```

데이터베이스와 유저 생성:
```sql
CREATE DATABASE panda_market;
CREATE USER panda_user WITH PASSWORD 'panda1234';
GRANT ALL PRIVILEGES ON DATABASE panda_market TO panda_user;
```

데이터베이스에 연결하여 권한 부여:
```sql
\c panda_market
GRANT ALL ON SCHEMA public TO panda_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO panda_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO panda_user;
\q
```

### 4. 스키마 생성

```bash
psql -U postgres -d panda_market -f schema.sql
```

또는 psql 내부에서:
```bash
psql -U postgres -d panda_market
```
```sql
\i schema.sql
```

테이블 소유자를 panda_user로 변경:
```bash
psql -U postgres -d panda_market << 'EOF'
ALTER TABLE notifications OWNER TO panda_user;
ALTER TABLE users OWNER TO panda_user;
ALTER TABLE products OWNER TO panda_user;
ALTER TABLE posts OWNER TO panda_user;
ALTER TABLE post_comments OWNER TO panda_user;
ALTER TABLE product_comments OWNER TO panda_user;
ALTER TABLE product_likes OWNER TO panda_user;
ALTER TABLE categories OWNER TO panda_user;
ALTER TABLE boards OWNER TO panda_user;
ALTER FUNCTION notify_price_change() OWNER TO panda_user;
ALTER FUNCTION notify_post_comment() OWNER TO panda_user;
ALTER FUNCTION notify_product_comment() OWNER TO panda_user;
ALTER FUNCTION update_timestamp() OWNER TO panda_user;
EOF
```

### 5. 테스트 데이터 생성
```bash
npm run seed
```

### 6. 서버 실행
```bash
npm start
```

### 7. 브라우저 접속
http://localhost:3000

## 기능
### 파일 구조

```
sprint_mission_8/
├── server.js              # Express + Socket.IO 서버
├── seed.js                # 테스트 데이터 생성 스크립트
├── package.json           # 의존성 설정 (socket.io, dotenv)
├── schema.sql             # 데이터베이스 스키마
├── queries.sql            # SQL 쿼리 모음
├── .env.example           # 환경변수 예시 파일
├── .env                   # 환경변수 설정 파일 (git에서 제외)
├── public/
│   └── index.html        # 클라이언트 UI (Socket.IO 클라이언트)
└── README.md             # 이 파일
```

### 기술 스택

- **Backend**: Node.js, Express
- **WebSocket**: Socket.IO v4.7
- **Database**: PostgreSQL
- **Environment**: dotenv
- **Features**: PostgreSQL LISTEN/NOTIFY, Room 기반 알림 전송

### 테이블 (14개):
- users, products, product_images, product_likes, product_comments, product_tags
- posts, post_comments, post_likes
notifications
- categories, tags, boards, reservations

### 함수 (4개):
- update_timestamp() - 업데이트 시간 자동 갱신
- notify_price_change() - 상품 가격 변경 시 알림
- notify_post_comment() - 게시글 댓글 작성 시 알림
- notify_product_comment() - 상품 댓글 작성 시 알림


<img width="626" height="738" alt="스크린샷 2025-11-11 오후 1 50 07" src="https://github.com/user-attachments/assets/c46d191c-380a-4dc0-8536-c0b66228b5a8" />

<img width="696" height="287" alt="스크린샷 2025-11-11 오후 1 50 27" src="https://github.com/user-attachments/assets/c2195e6d-ed39-4de0-9b5d-44ae953b053f" />

### 서버가 종료되고 시작되어도 바로 열려있는 웹사이트에서 서버상태를 체크할수있습니다.
