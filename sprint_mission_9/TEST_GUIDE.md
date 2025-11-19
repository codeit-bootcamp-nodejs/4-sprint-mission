# Sprint Mission 9 - 테스트 가이드

## ✅ 서버 실행 확인

### 백엔드 (포트 9999)
```bash
cd backend
npm run dev
```
- 실행 확인: http://localhost:9999/health
- API 확인: http://localhost:9999/api/products

### 프론트엔드 (포트 3000)
```bash
cd frontend
npm run dev
```
- 메인 페이지: http://localhost:3000

## 🔧 현재 상태

### ✅ 백엔드
- ✅ 서버 실행 중 (포트 9999)
- ✅ 시드 데이터 로드 완료
  - 👥 사용자 3명 (alice@example.com, bob@example.com, charlie@example.com)
  - 📱 상품 4개
  - 📝 게시글 3개
  - 💬 댓글 5개
  - ❤️ 좋아요 8개

### ✅ 프론트엔드
- ✅ Next.js 서버 실행 중 (포트 3000)
- ✅ 환경변수 설정 완료 (.env.local)
- ✅ API 연동 수정 완료
- ✅ WebSocket UI 구현 완료

## 🧪 테스트 순서

### 1. 메인 페이지 확인
- http://localhost:3000 접속
- ✅ "Sprint Mission 9" 헤더 표시
- ✅ 상품 4개 표시
- ✅ 게시글 3개 표시
- ✅ WebSocket 실시간 알림 UI 표시

### 2. 회원가입/로그인
```
테스트 계정:
- Email: alice@example.com
- Password: password123

또는 새로 회원가입
```

### 3. 기능 테스트
- 상품 좋아요 누르기
- 게시글 좋아요 누르기
- 상품 상세 페이지 이동
- 게시글 상세 페이지 이동

### 4. WebSocket UI 확인
- 메인 페이지 하단의 "실시간 알림 (WebSocket)" 섹션 확인
- 연결 상태 표시 (초록색 점)
- 예시 알림 3개 표시
  - 댓글 알림 (파란색)
  - 좋아요 알림 (빨간색)
  - 답글 알림 (회색 - 읽음)

## 🐛 문제 해결

### API 연결 오류
```bash
# 백엔드 로그 확인
tail -f backend/logs/*.log

# 백엔드 재시작
cd backend
npm run dev
```

### 프론트엔드 오류
```bash
# 프론트엔드 재시작
cd frontend
npm run dev
```

### 데이터가 안 보일 때
```bash
# 시드 데이터 재생성
cd backend
npm run seed
```

## 📊 API 엔드포인트 테스트

```bash
# 상품 목록
curl http://localhost:9999/api/products

# 게시글 목록
curl http://localhost:9999/api/articles

# 헬스 체크
curl http://localhost:9999/health
```

## 🎯 구현 완료 항목

### README 변경사항
- ✅ 제목: "Sprint Mission 9"
- ✅ API 기능 섹션 추가
- ✅ WebSocket 실시간 기능 섹션 추가

### 프론트엔드 변경사항
- ✅ 헤더: "Sprint Mission 9"
- ✅ 기능 테스트 UI 테이블 제거
- ✅ WebSocket 실시간 알림 UI 추가
- ✅ API 응답 포맷 수정 (data.data 지원)

### 백엔드
- ✅ 모든 API 정상 작동
- ✅ 시드 데이터 로드 완료
- ✅ 테스트 178개 모두 통과 (100%)
