# Mission9 프론트엔드

백엔드 API와 연동되는 React + Vite 기반 프론트엔드 애플리케이션입니다.

## 설치 및 실행

1. 의존성 설치:
```bash
cd front
npm install
```

2. 개발 서버 실행:
```bash
npm run dev
```

3. 브라우저에서 `http://localhost:5173` 접속

## 주요 기능

### 인증
- 회원가입 (`/signup`)
- 로그인 (`/login`)
- 프로필 조회 및 수정 (`/profile`)
- 비밀번호 변경 (`/change-password`)

### 상품 관리
- 상품 목록 조회 (`/products`)
- 상품 등록 (`/products/new`)
- 상품 수정 (`/products/:id/edit`)
- 상품 삭제
- 내가 등록한 상품 목록 (`/my-products`)

### 게시글 관리
- 게시글 목록 조회 (`/posts`)
- 게시글 작성 (`/posts/new`)
- 게시글 수정 (`/posts/:id/edit`)
- 게시글 삭제

### 알림
- 알림 목록 조회 (`/notifications`)
- 미읽음 알림 개수 표시
- 알림 읽음 처리

## 기술 스택

- React 18
- TypeScript
- Vite
- React Router DOM

## 백엔드 연동

프론트엔드는 `http://localhost:3000`에서 실행되는 백엔드 API와 통신합니다.
Vite의 프록시 설정을 통해 API 요청이 자동으로 백엔드로 전달됩니다.

## 환경 변수

현재는 하드코딩된 API 베이스 URL을 사용하고 있습니다. 필요시 `.env` 파일을 생성하여 설정할 수 있습니다.

