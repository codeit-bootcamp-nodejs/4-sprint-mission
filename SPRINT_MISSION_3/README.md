# 📌 프로젝트 체크리스트

## 1. 스키마 설계
- [v] id, title, content, createdAt, updatedAt 필드 작성

## 2. 게시글 API
- [v] 게시글 등록 API (title, content 입력)
- [v] 게시글 상세 조회 API (id, title, content, createdAt)
- [v] 게시글 수정 API
- [v] 게시글 삭제 API
- [v] 게시글 목록 조회 API
  - [v] offset 방식 페이지네이션
  - [v] 최신순(recent) 정렬
  - [v] title, content 검색 기능

## 3. 댓글 API
- [v] 댓글 등록 API (content 입력)
  - [v] 중고마켓 댓글 등록 API
  - [v] 자유게시판 댓글 등록 API
- [v] 댓글 수정 API (PATCH 메서드)
- [v] 댓글 삭제 API
- [v] 댓글 목록 조회 API (id, content, createdAt)
  - [v] cursor 방식 페이지네이션
  - [v] 중고마켓 댓글 목록 조회 API
  - [v] 자유게시판 댓글 목록 조회 API

## 4. 유효성 검증
- [v] 상품 등록 필드 검증 (이름, 설명, 가격 등)
- [v] 게시물 등록 필드 검증 (제목, 내용 등)

## 5. 이미지 업로드
- [v] multer 미들웨어 구현
- [v] 이미지 서버 저장
- [v] 업로드된 이미지 경로 response로 반환

## 6. 에러 처리
- [v] 전역 에러 핸들러 미들웨어 구현
- [v] 서버 오류(500), 사용자 입력 오류(400), 리소스 없음(404) 처리

## 7. 라우트 최적화
- [v] app.route()로 중복 경로 통합
- [v] express.Router()로 중고마켓/자유게시판 라우트 분리

## 8. 배포 준비
- [v] .env 환경 변수 설정
- [v] CORS 설정
- [v] render.com 배포


## 📷 Render 배포 로그
![Render Deployment Log](C:\Users\bjl06\OneDrive\사진\README\1.png)
