// main.js
import { getProductList, createProduct } from './services/ProductService.js';
import { getArticleList, createArticle } from './services/ArticleService.js';

console.log('📦 상품 리스트 가져오기');
const products = await getProductList({ page: 1, pageSize: 5 });
products.forEach((product, idx) => {
  console.log(`상품 ${idx + 1}:`, product);
});

console.log('📝 게시글 리스트 가져오기');
const articles = await getArticleList({ page: 1, pageSize: 5 });
console.log(articles);

console.log('🆕 상품 생성하기');
const newProduct = await createProduct({
  name: '테스트 상품',
  description: '설명 텍스트',
  price: 9900,
  tags: ['테스트', '전자제품'],
  images: ['https://example.com/image.jpg']
});
console.log(newProduct);

console.log('🆕 게시글 생성하기');
const newArticle = await createArticle({
  title: '테스트 글',
  content: '내용 예시',
  image: 'https://example.com/image2.jpg'
});
console.log(newArticle);
