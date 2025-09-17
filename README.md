# SprintMission4

---

# 소개

이 프로젝트는 **SprintMission4**를 위해 작성되었습니다.
상품등록, 게시글, 댓글, 좋아요, 회원 기능들을 구현했습니다.

---

### 테스트 순서

Prisma 스키마 기반으로 마이그레이션 실행

npx prisma migrate dev --name init

DB 초기화

npx prisma migrate reset (seed 자동 실행됨.)

스키마 반영 확인

npx prisma studio

서버 실행

npm run dev

API 테스트 스크립트 실행

test.http

---
