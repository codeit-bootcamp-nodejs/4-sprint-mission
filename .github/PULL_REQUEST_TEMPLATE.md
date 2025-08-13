
## 요구사항

### 🟩 기본 기능

- [x] `Product` 클래스 구현  
  - [x] `name`, `description`, `price`, `tags`, `images`, `favoriteCount` 속성  
  - [x] `constructor` 정의  
  - [x] `favorite()` 메서드  

- [x] `ElectronicProduct` 클래스 구현 (`Product` 상속)  
  - [x] `manufacturer` 속성  
  - [x] `constructor` 정의 및 `super` 호출  

- [x] `Article` 클래스 구현  
  - [x] `title`, `article`, `writer`, `likeCount` 속성  
  - [x] `constructor` 정의  
  - [x] `like()` 메서드  

- [x] 객체지향 원칙 적용  
  - [x] 추상화  
  - [x] 캡슐화 (`get` / `set` 사용)  
  - [x] 상속  
  - [x] 다형성  

---

### 🟦 심화 기능

- [x] `Article` 클래스에 `createdAt` 속성 추가  
  - [x] 생성 시점에 현재 시간 자동 저장 (`new Date()` 사용)

---

## ✅ ArticleService 기능

> API 호출 방식: `fetch` + `.then()` / `.catch()`  
> Base URL: `https://panda-market-api-crud.vercel.app`

- [x] `getArticleList(page, pageSize, keyword)` – GET `/articles`  
- [x] `getArticle(articleId)` – GET `/articles/:articleId`  
- [x] `createArticle(title, article, image)` – POST `/articles`  
- [x] `patchArticle(articleId, title, article, image)` – PATCH `/articles/:articleId`  
- [x] `deleteArticle(articleId)` – DELETE `/articles/:articleId`  

---

## ✅ ProductService 기능

> API 호출 방식: `fetch` + `async/await` / `try/catch`  
> Base URL: `https://panda-market-api-crud.vercel.app`

- [x] `getProductList(page, pageSize, keyword)` – GET `/products`  
- [x] `getProduct(productId)` – GET `/products/:productId`  
- [x] `createProduct(name, description, price, tags, images)` – POST `/products`  
- [x] `patchProduct(productId, name, description, price, tags, images)` – PATCH `/products/:productId`  
- [x] `deleteProduct(productId)` – DELETE `/products/:productId`  

---

## ✅ main.js 기능

### 🟩 작업 1: 상품 리스트 인스턴스화

- [x] `getProductList()` 호출하여 상품 불러오기  
- [x] 태그에 “전자제품” 포함 → `ElectronicProduct` 생성  
- [x] 그 외 → 일반 `Product` 인스턴스 생성  
- [x] 모두 `products` 배열에 저장  

### 🟩 작업 2: 서비스 함수 테스트

- [x] `getArticleList()` 테스트  
- [x] `createArticle()` 테스트  
- [x] 콘솔에 결과 출력 확인

---

## 📁 디렉토리 구조 예시
├── Product.js
├── Article.js
├── ProductService.js
├── ArticleService.js
└── main.js