# Panda Market Mission

이 프로젝트는 가상의 서비스 "Panda Market"의 상품 및 게시글 데이터를 관리하는 JavaScript 애플리케이션입니다. REST API와 통신하여 데이터를 처리하며, 객체 지향 프로그래밍(OOP) 원칙과 최신 JavaScript 문법(ESM)을 학습하는 것을 목표로 합니다.

## 🚀 주요 기능

- **데이터 모델링**: `Product`, `ElectronicProduct`, `Article` 클래스를 통해 데이터를 객체 지향적으로 관리합니다.
- **API 연동**: `axios` 라이브러리를 사용하여 외부 API와 비동기적으로 통신합니다.
  - 상품(Product) 및 게시글(Article) 정보에 대한 CRUD(생성, 조회, 수정, 삭제) 기능을 구현합니다.
- **비동기 처리**: `.then/.catch` 및 `async/await` 두 가지 방식을 모두 사용하여 비동기 코드를 작성합니다.
- **코드 품질**: `ESLint`와 `Prettier`를 도입하여 일관된 코드 스타일을 유지하고 잠재적인 오류를 방지합니다.

## 📂 프로젝트 구조

```
codeit-mission/
├── models/
│   ├── Article.js       # Article 클래스 정의
│   └── Product.js       # Product, ElectronicProduct 클래스 정의
├── services/
│   ├── ArticleService.js  # Article 관련 API 함수
│   └── ProductService.js  # Product 관련 API 함수
├── main.js                # 메인 실행 파일 (기능 테스트 및 인스턴스 생성)
└── package.json           # 프로젝트 정보 및 의존성 관리  
```

## 🏁 시작하기

### 1. 의존성 설치

프로젝트를 실행하기 위해 필요한 라이브러리를 설치합니다.

```bash
npm install
```

### 2. 스크립트 실행

메인 스크립트를 실행하여 API 연동 및 클래스 인스턴스 생성 결과를 콘솔에서 확인할 수 있습니다.

```bash
node main.js
```

## 🛠️ 사용 가능한 스크립트

- **코드 린팅**: `ESLint`를 사용하여 코드 스타일 및 오류를 검사합니다.
  ```bash
  npm run lint
  ```

- **코드 포맷팅**: `Prettier`를 사용하여 코드를 자동으로 정렬합니다.
  ```bash
  npm run format
  ```

## 💻 사용 기술

- Node.js
- JavaScript (ES Modules)
- [axios](https://axios-http.com/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
