# Panda Market Backend - 인증/인가 + 상품/게시글/댓글 + 실시간 알림 미션

## 프로젝트 개요
본 프로젝트는 Panda Market을 기반으로 한 백엔드 미션입니다.  
토큰 기반 인증/인가, Prisma ORM을 활용한 관계형 데이터 모델, 그리고 실시간 알림 기능을 포함합니다.

---

## 기술 스택
- Node.js, Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT (Access / Refresh Token)
- Socket.IO
- bcrypt

---

## 기능 요구사항

### 1. 유저(User)
- User 스키마 작성: `id, email, nickname, image, password, createdAt, updatedAt`
- 회원가입 API (`email, nickname, password` 입력)
- 비밀번호 해싱 후 저장
- 로그인 API (로그인 성공 시 Access Token 발급)

---

### 2. 상품 기능
- 로그인한 유저만 상품 등록 가능
- 상품 등록자만 해당 상품 수정 가능
- 상품 등록자만 해당 상품 삭제 가능

---

### 3. 게시글 기능
- 로그인한 유저만 게시글 등록 가능
- 게시글 작성자만 해당 게시글 수정 가능
- 게시글 작성자만 해당 게시글 삭제 가능

---

### 4. 댓글 기능
- 로그인한 유저만 상품에 댓글 등록 가능
- 로그인한 유저만 게시글에 댓글 등록 가능
- 댓글 작성자만 해당 댓글 수정 가능
- 댓글 작성자만 해당 댓글 삭제 가능

---

### 5. 유저 정보
- 유저 본인 정보 조회 가능
- 유저 본인 정보 수정 가능
- 유저 비밀번호 변경 가능
- 유저가 등록한 상품 목록 조회 가능
- 응답(Response)에 비밀번호 노출 금지

---

### 6. 좋아요 기능
- 로그인한 유저는 상품에 좋아요 / 좋아요 취소 가능
- 로그인한 유저는 게시글에 좋아요 / 좋아요 취소 가능
- 상품/게시글 조회 시 해당 유저의 좋아요 여부(`isLiked`) 포함
- 유저가 좋아요한 상품 목록 조회 가능

---

### 7. 인증/토큰
- Refresh Token을 이용한 토큰 갱신 기능 구현

---

### 8. 알림(Notification) 기능
#### 알림 관리
- 사용자는 자신의 알림 목록 조회 가능
- 사용자는 안 읽은 알림 개수 조회 가능
- 사용자는 자신의 알림을 읽음 처리 가능
- 클라이언트에서는 실시간으로 알림 수신 가능 (웹소켓 / Socket.IO)

#### 알림 전송 트리거
- 사용자가 좋아요한 상품의 가격 변동 시 알림 전송
- 사용자가 작성한 게시글에 댓글이 달렸을 때 알림 전송

---

## 데이터베이스 스키마 예시 (Prisma)

```prisma
model User {
  notifications Notification[]
}
model Notification {
  id          Int       @id @default(autoincrement())
  userId      Int
  type        String    // e.g. "PRICE_CHANGE", "COMMENT"
  message     String
  isRead      Boolean   @default(false)
  createdAt   DateTime  @default(now())

  user        User      @relation(fields: [userId], references: [id])
}
