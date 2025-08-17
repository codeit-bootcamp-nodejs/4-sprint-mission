import ProductService from './ProductService.js';
import ArticleService from './ArticleService.js';

async function testProductAPI() {
  try {
    // 1. 상품 목록 조회
    const productList = await ProductService.getProductList({ page: 1, pageSize: 5, keyword: '' });
    console.log('[상품 목록]', productList);

    if (productList.length === 0) return;

    const sampleProductId = productList[0]._id;

    // 2. 상품 상세 조회
    const product = await ProductService.getProduct(sampleProductId);
    console.log('[상품 상세]', product);

    // 3. 상품 생성
    const newProduct = await ProductService.createProduct({
      name: '테스트 상품',
      description: '테스트 설명',
      price: 9999,
      tags: ['테스트', '전자제품'],
      images: ['https://via.placeholder.com/150']
    });
    console.log('[상품 생성]', newProduct);

    // 4. 상품 수정
    const updatedProduct = await ProductService.patchProduct(newProduct._id, {
      name: '수정된 테스트 상품',
      price: 10000
    });
    console.log('[상품 수정]', updatedProduct);

    // 5. 상품 삭제
    const deleted = await ProductService.deleteProduct(newProduct._id);
    console.log('[상품 삭제]', deleted);

  } catch (err) {
    console.error('[Product API 에러]', err.message);
  }
} 


async function testArticleService() {
  // 1. 게시글 목록 조회
  const articleList = await ArticleService.getArticleList({ page: 1, pageSize: 5, keyword: '' });
  console.log('게시글 목록:', articleList);

  // 2. 게시글 상세 조회 (예: id = 1)
  const article = await ArticleService.getArticle(1);
  console.log('게시글 상세:', article);

  // 3. 게시글 생성
  const newArticleData = {
    title: '테스트 글 제목',
    content: '테스트 내용입니다.',
    image: 'https://example.com/test-image.jpg',
  };
  const createdArticle = await ArticleService.createArticle(newArticleData);
  console.log('생성된 게시글:', createdArticle);

  // 4. 게시글 수정 (예: id = createdArticle.id)
  if (createdArticle && createdArticle.id) {
    const updatedArticle = await ArticleService.patchArticle(createdArticle.id, {
      title: '수정된 제목',
      content: '수정된 내용',
      image: 'https://example.com/updated-image.jpg',
    });
    console.log('수정된 게시글:', updatedArticle);

    // 5. 게시글 삭제
    const deleteResult = await ArticleService.deleteArticle(createdArticle.id);
    console.log('삭제 결과:', deleteResult);
  }
}

testArticleService();
