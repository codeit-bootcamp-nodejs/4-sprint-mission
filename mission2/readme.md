## 이용한 기술 스택: API, fetch, async/ await

해당코드에서 Product class 와 Article class, product 생성자에서 상속 받은 electronic product class 를 만든후, 해당 각각의 인스턴스들을 지정해두었다. 그런다음 서버와 통신을 위한 여럿 메소드들을 생성하였다. Article 부분은 axios 중심으로 코드로 짰고, Product 부분은 fetch부분을 중심으로 코드를 짯다. 그런다음 비동기함수인 getProductList에서 제품들을 받아와서 배열화 하였고, 이과정에서 tags 가 전자기기 분류하였고, 나머지는 device로 분류 하였다. 그런다음 코드의 가독성을 위해서 Article 관련된 비동기 함수들을 모두 API 안 article서비스 파일내 정리 하고 export 처리를 하였고, 다른 api 관련 함수는 product 서비스로 정리 및 export 처리 하였다. 그런다음 main 에다가 전부 import를 해두었다.


## 어려웠던 점
당연히 비동기 함수들을 짜는 부분이었던 것 같다. 처음에 fetch랑 axios개념이 혼동이 되서 fetch 부분에 await을 안쓴다던지, 헤더 설정, 바디 설정, 직렬화, 해당 비동기 함수들의 코드를 짜는 순서, 받은 데이터의 배열화 였다.  

## 배웠던 점
당연히 fetch 개념과 axios개념 차이점, 해당 코드들의 코드짜는 순서 였다.


## 공부를 헤야 할점
1. 해더를 왜 설정해야 하는가?

2. 헤더 내부
