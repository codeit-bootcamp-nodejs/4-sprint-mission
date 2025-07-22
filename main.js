// ProductService.js 파일에서 필요한 클래스와 함수들을 한 번에 불러옴(import)
import {
  ElectronicProduct,
  getProductList,
  createProduct,
} from './ProductService.js';

// ArticleService.js 파일에서 필요한 클래스와 함수들을 한 번에 불러옴(import)
import {
  Article,
  getArticleList,
  createArticle,
} from './ArticleService.js';

// 즉시 실행되는 비동기 함수(주로 테스트나 메인 실행 코드에 사용)
(async () => {
  // 상품 목록을 불러와서 products 변수에 저장 (최대 5개)
  const products = await getProductList({ page: 1, pageSize: 5 });
  // 불러온 상품 인스턴스 배열을 콘솔에 출력
  console.log('상품 인스턴스 배열:', products);
  // 상품 배열을 순회하면서
  products.forEach((prod) => {
    // 만약 ElectronicProduct 인스턴스라면 전자제품으로, 아니면 일반상품으로 출력
    console.log(
      prod instanceof ElectronicProduct
        ? `[전자제품] ${prod.name} - 제조사: ${prod.manufacturer}`
        : `[일반상품] ${prod.name}`,
    );
  });

  // 상품 생성 테스트: 새 상품을 서버에 등록
  const newProd = await createProduct({
    name: '테스트 상품', // 상품명
    description: '테스트 설명', // 상품 설명
    price: 10000, // 가격
    tags: ['테스트', '전자제품'], // 해시태그 배열 ("전자제품"이면 ElectronicProduct로 생성됨)
    images: ['https://img.com/1.jpg'], // 이미지 배열
  });
  // 서버에서 응답받은 생성된 상품 정보 출력
  console.log('생성된 상품:', newProd);

  // favorite() 테스트: 첫 번째 상품이 있으면 찜하기 메소드 실행
  if (products.length > 0) {
    products[0].favorite(); // 찜하기 수 1 증가
    console.log('favorite() 후 찜 수:', products[0].favoriteCount);
  }
})(); // 즉시 실행 함수 끝

// 게시글 리스트 불러오기 (page, pageSize, 검색어 사용)
getArticleList({ page: 1, pageSize: 5, keyword: '' }).then((articles) => {
  // 받아온 게시글 배열 출력
  console.log('게시글 리스트:', articles);

  // Article 인스턴스 생성 및 like() 테스트
  if (articles.length > 0) {
    // 받아온 첫 번째 게시글로 Article 객체 생성 (writer 없으면 '익명'으로)
    const articleObj = new Article({
      ...articles[0],
      writer: articles[0].writer || '익명',
    });
    // like() 메서드로 좋아요 1 증가
    articleObj.like();
    // 좋아요 수, 생성일자 콘솔 출력
    console.log('like() 후 좋아요 수:', articleObj.likeCount);
    console.log('생성일자:', articleObj.createdAt);
  }

  // 게시글 생성 테스트
  createArticle({
    title: 'API 생성 테스트', // 게시글 제목
    content: '테스트 내용입니다', // 게시글 본문
    image: 'https://img.com/test.jpg', // 첨부 이미지
  }).then((created) => {
    // 생성된 게시글 정보 출력
    console.log('생성된 게시글:', created);
  });
});
