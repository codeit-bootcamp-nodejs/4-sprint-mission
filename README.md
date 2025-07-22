# 4-Sprint-Mission

## 소개

이 프로젝트는 판다마켓 API를 활용해 상품 및 게시글 CRUD 기능을 구현하는 Node.js/ESM 실습입니다.

- 클래스/상속/비동기처리/모듈 분리 등 실무 역량 강화 목적

## 폴더 구조

/market-mission

├─ main.js

├─ ProductService.js

├─ ArticleService.js

└─ README.md

## 주요 기능

- Product, ElectronicProduct, Article 클래스 및 메소드 구현
- 상품/게시글 CRUD (API 연동)
- 모듈화(import/export), 비동기 처리, 에러 핸들링

## 사용 방법

1. Node.js 환경에서 `npm init -y`, `package.json`에 "type": "module" 추가
2. `node main.js`로 실행
3. 콘솔에서 동작 결과 확인

## 미션 체크리스트

- [x] Product, ElectronicProduct 클래스 구현
- [x] Article 클래스 구현
- [x] 각 클래스 메소드(favorite, like) 구현
- [x] Article, Product API 함수(전체/상세/생성/수정/삭제)
- [x] async/await, try/catch, .then/.catch 사용
- [x] 상품/게시글 인스턴스화, 다형성 적용
- [x] 코드 파일 분리 및 모듈화
- [x] main.js에서 전체 동작 테스트
- [x] README.md 작성
- [x] 기타: 리팩토링, 주석 추가, 커밋 메시지 개선 등

## 멘토님에게 남기는 메시지

- 전체 구조와 로직, 코딩 스타일 리뷰해주시면 감사하겠습니다!
