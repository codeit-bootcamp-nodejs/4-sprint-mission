# 스프린트 미션 요구사항 체크리스트

## 클래스 구현하기

- [x]  `class` 키워드를 사용해서 `Product`, `ElectronicProduct` 클래스를 생성
    - [x]  `Product` 클래스의 프로퍼티가 적절하게 존재
    - [x]  `Product` 클래스는 `favorite` 메소드 존재
        - [x]  `favorite` 메소드가 호출될 경우 찜하기 수가 1 증가
    - [x]  `ElectronicProduct` 클래스는 `Product`를 상속
        - [x]  추가로 `manufacturer`(제조사) 프로퍼티를 가짐
- [x]  `class` 키워드를 이용해서 `Article` 클래스를 만들어 주세요.
    - [x]  `Article` 클래스는 프로퍼티가 적절하게 존재
    - [x]  `Article` 클래스는 `like` 메소드
        - [x]  `like` 메소드가 호출될 경우 좋아요 수가 1 증가합니다.
- [x]  각 클래스 마다 **`constructor`**를 작성
- [ ]  추상화/캡슐화/상속/다형성을 고려

## Article 요청 함수 구현하기

- [x]  ['https://panda-market-api-crud.vercel.app/docs'](https://panda-market-api-crud.vercel.app/docs) 의 Article API를 이용하여 아래 함수들을 구현
    - [x]  `getArticleList()` : GET 메소드를 사용
        - [x]  `page`, `pageSize`, `keyword` 쿼리 파라미터를 이용
    - [x]  `getArticle()` : GET 메소드를 사용
    - [x]  `createArticle()` : POST 메소드를 사용
        - [x]  request body에 `title`, `content`, `image` 를 포함
    - [x]  `patchArticle()` : PATCH 메소드를 사용
    - [x]  `deleteArticle()` : DELETE 메소드를 사용
- [x]  `fetch` 혹은 `axios`를 이용
    - [x]  응답의 상태 코드가 2XX가 아닐 경우, 에러 메시지를 콘솔에 출력
- [x]  `.then()` 메소드를 이용하여 비동기 처리
- [x]  `.catch()` 를 이용하여 오류 처리

### Article 요청 함수 구현하기 (심화)

- [x]  Article 클래스에 `createdAt`(생성일자) 프로퍼티 생성
    - [x]  새로운 객체가 생성되어 constructor가 호출될 시 `createdAt`에 현재 시간을 저장

## Product 요청 함수 구현하기

- [x]  ‘[https://panda-market-api-crud.vercel.app/docs’](https://panda-market-api-crud.vercel.app/docs) 의 Product API를 이용하여 아래 함수들을 구현
    - [x]  `getProductList()` : GET 메소드를 사용
        - [x]  `page`, `pageSize`, `keyword` 쿼리 파라미터를 이용
    - [x]  `getProduct()` : GET 메소드를 사용
    - [x]  `createProduct()` : POST 메소드를 사용
        - [x]  request body에 `name`, `description`, `price`, `tags`, `images` 를 포함
    - [x]  `patchProduct()` : PATCH 메소드를 사용
    - [x]  `deleteProduct()` : DELETE 메소드를 사용
- [x]  `async/await` 을 이용하여 비동기 처리
- [x]  `try/catch` 를 이용하여 오류 처리
- [x]  `getProductList()`를 통해서 받아온 상품 리스트를 각각 인스턴스로 만들어 `products` 배열에 저장
    - [x]  해시태그에 “**전자제품**”이 포함되어 있는 상품들은 `Product` 클래스 대신 `ElectronicProduct` 클래스를 사용해 인스턴스를 생성
    - [x]  나머지 상품들은 모두 `Product` 클래스를 사용해 인스턴스를 생성
- [x]  구현한 함수들을 아래와 같이 파일을 분리
    - [x]  **export**를 활용
    - [x]  `ProductService.js` 파일 **Product** API 관련 함수들을 작성
    - [x]  `ArticleService.js` 파일에 **Article** API 관련 함수들을 작성
- [x]  이외의 코드들은 모두 `main.js` 파일에 작성
    - [x]  **import**를 활용
    - [x]  각 함수를 실행하는 코드를 작성하고, 제대로 동작하는지 확인

# 주요 변경 사항

## **`Article` API 함수 구현 (`.then/.catch` 사용)**

### **주요 기능 및 해결 과정**

- **동적 쿼리 파라미터 처리**
    - 값이 `undefined`인 파라미터가 URL 쿼리에 포함되는 문제 발견
    - `if` 조건문으로 값이 존재할 때만 `append`가 실행되도록 수정
- **비동기 함수의 반환 값 처리**
    - `fetch`를 사용한 비동기 함수를 `console.log`로 직접 호출 시 `undefined`가 출력되는 현상 확인
    - 원인: `Promise`가 처리되기 전 함수가 먼저 종료되어 값을 반환하지 못함
    - 해결: 함수 내에서 `fetch` Promise 체인 전체를 `return`하고, 함수 호출부에서 `.then()`으로 데이터를 받도록 구조 변경
- **에러 핸들링 강화**
    - `response.ok`가 `false`일 때 `if` 블록을 사용해 명시적으로 `Error`를 `throw`하도록 수정
    - `.catch` 블록에서 에러를 콘솔에 출력 후 **다시 `throw`*하여, 함수를 호출한 상위 스코프까지 에러가 전파되도록 처리
- **파라미터 유효성 검사**
    - `articleId`, `page` 등 숫자 값 파라미터에 대해 `isNaN()`으로 타입 체크 로직 추가
    - `orderBy` 파라미터는 API 명세에 명시된 값('recent', 'like')만 허용하도록 로직 개선

## **`Product` API 함수 구현 (`async/await` 사용)**

### **주요 기능 및 해결 과정**

- **API 응답 데이터 파싱**
    - 문제: API 응답 객체(`data`) 전체가 아닌, 실제 목록 데이터가 담긴 **`data.list` 배열**을 순회해야 함을 발견
    - 해결: `for...of` 루프를 사용해 `data.list` 배열을 순회하도록 수정
- **조건부 클래스 인스턴스화**
    - 문제: `tags` 프로퍼티는 문자열이 아닌 배열이므로 `===` 연산자 비교가 부적절함을 인지
    - 해결: **`tags.includes('전자제품')`** 메소드를 사용하여 배열 포함 여부를 확인하는 방식으로 로직 변경

## **전체 구조 리팩토링 및 디버깅**

### **주요 개선 사항**

- **`URL` 객체 스코프 문제 해결**
    - 문제: 여러 함수가 **하나의 전역 `URL` 객체를 공유**하여 쿼리나 `pathname`이 오염되는 심각한 버그 확인
    - 해결: 각 API 함수 내에서 **매번 새로운 `URL` 객체를 생성**하도록 변경하여 함수의 독립성 확보
- **비동기 테스트 코드 개선**
    - 문제: 테스트 코드 실행 시 `console.log`로 출력한 제목과 비동기 함수의 결과 출력 순서가 일치하지 않음
    - 해결: `async` 테스트 함수 내에서 각 API 함수 호출 앞에 `await`을 붙여 실행 순서를 명확히 보장
- **코드 모듈화**
    - `main.js`에 정의된 클래스들을 각 기능에 맞는 파일로 이동하는 것을 고려

# 멘토님에게 남길 메세지

- 코드가 요구 사항을 잘 지켜졌나요?
- 코드의 수정 혹은 리펙토링을 어떤식으로 진행해야 할까요?
- 좀 더 좋은 코드의 정의와 구현 방법에는 뭐가 있을까요?
    - `if`문을 사용하여 파라미터의 조건을 확인하였는데. 너무 반복되는 것 같습니다. 좋은 해결 방법이 있을까요??
    - `URL`객체를 전역으로 사용하다 오염되어서 버그가 발생하여 함수별로 생성되도록 수정했는데, 다른 방법이 있을까요??
    - `promise`가 결과를 반환해야 외부에서 그 결과를 사용한다고 이해했는데 이게 개념이 맞는건지, 일반적으로 이렇게 사용하나요??
- 처음에 스프린트 미션을 딱 봤을 때 어떻게 해야하는 지 몰랐습니다. 그래서 클래스 구현 같이 기본적으로 할 수 있는 것을 진행하였고, 추후 배워왔던 내용을 복습하고, 요구 사항에서 제시한 문제들을 최대한 사용할 수 있는(이해할 수 있는) 개념으로 쪼개가지고 제가 배웠던 내용을 적용 시켜서 작성한 것 같습니다. 추후 다른 프로젝트를 진행하거나 실무에서는 이런 방식으로 진행하는 것이 괜찮은지 잘 모르겠습니다.
- 추가적으로 멘토님이 보셨을 때 공부하면 좋을 것 같은 분야/내용이나, 참고할만한 도서가 있을까요?

## 참고자료

미션을 진행하면서 작성한 내용입니다. 조금 정리가 되지는 않았지만, 필요하실 수도 있을 것 같아서 링크 첨부합니다.

[스프린트 미션 2](https://www.notion.so/2-2319973fabd7805db7a9c2fc50426f93?pvs=21)