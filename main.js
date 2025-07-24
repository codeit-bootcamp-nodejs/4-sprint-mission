import { Article } from './src/models/Article.js'
import { ElectronicProduct, Product } from './src/models/Product.js'
import { getArticleList, getArticle, createArticle, patchArticle, deleteArticle } from './src/services/ArticleService.js'
import { getProductList, getProduct, createProduct, patchProduct, deleteProduct } from './src/services/ProductService.js'



async function runAll() {
//아티클 클래스 테스트  
  const article = new Article('자기소개입니다.', '반갑습니다', '홍길동'); 
  article.like();
  console.log('Article 클래스 테스트');
  console.log('제목:', article.title);
  console.log('좋아요 수:', article.likeCount);
  console.log('작성자:', article.writer);
  console.log('작성시간:', article.createdAt);
//프로덕트 클래스 테스트
  const product = new Product('에어팟', '무선 이어폰', 100000, ['전자제품'], ['image.jpg']);
  product.favorite();
  console.log(product);
  console.log(product.getInfo());
  console.log('Product 클래스 테스트');
  console.log('상품명:', product.name);
  console.log('찜 수:', product.favoriteCount);

  const electronicProduct = new ElectronicProduct('에어팟', '무선 이어폰', 100000, ['전자제품'], ['image.jpg'],undefined,'애플');
  electronicProduct.favorite();
  console.log(electronicProduct);
  console.log(electronicProduct.getInfo());
  console.log('electronicProduct 클래스 테스트');
  console.log('상품명:', electronicProduct.name);
  console.log('제조사:', electronicProduct.manufacturer);

  //아티클 API 함수 테스트
  console.log('Article API 테스트');

  await getArticleList();
  const createdArticle = await createArticle('테스트', '내용', 'https://example.com/...');
  let createdArticleId;
    if (createdArticle) {  
    createdArticleId = createdArticle.id
  } else {
    console.error(`Article 생성 실패`);
    return;
  }
  await getArticle(createdArticleId);
  await patchArticle(createdArticleId, {title: '수정된 제목임.'});
  await deleteArticle(createdArticleId);
//프로덕트 API 함수 테스트
  console.log('Product API 테스트');

  await getProductList();
  const createdProduct = await createProduct('멋진 냉장고', '냉장고', 200000, ['전자제품'], ['https://example.com/...'])  //name, description, price, tags, images
  let createdProductId;
  if (createdProduct) {  
    createdProductId = createdProduct.id
  } else {
    console.error(`Product 생성 실패`);
    return;
  }
  await getProduct(createdProductId);
  await patchProduct(createdProductId, {name: '보통 냉장고'});
  await deleteProduct(createdProductId);   // 삭제하고나서 삭제된 키와 밸류를 서버로 부터 반환받는다.

  
}

runAll();