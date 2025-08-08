import { Product, ElectronicProduct } from './models/Product.js';
import { Article } from './models/Article.js';
import { getProductList, createProduct } from './services/ProductService.js';
import { getArticleList, createArticle } from './services/ArticleService.js';

// 작업 1: Product 인스턴스 생성
async function createProductInstances() {
  try {
    const productData = await getProductList();
    const products = [];

    productData.list.forEach((product) => {
      if (product.tags.includes('전자제품')) {
        const electronicProduct = new ElectronicProduct(
          product.name,
          product.description,
          product.price,
          product.tags,
          product.images,
          product.favoriteCount,
          product.manufacturer, // 일부 데이터엔 없을 수 있음
        );
        products.push(electronicProduct);
      } else {
        const normalProduct = new Product(
          product.name,
          product.description,
          product.price,
          product.tags,
          product.images,
          product.favoriteCount,
        );
        products.push(normalProduct);
      }
    });

    console.log('생성된 Product 인스턴스 목록:', products);
    return products;
  } catch (error) {
    console.error('상품 인스턴스 생성 중 오류 발생:', error);
  }
}

// 작업 1 (추가): Article 인스턴스 생성
async function createArticleInstances() {
  try {
    const articleData = await getArticleList();
    const articles = [];

    articleData.list.forEach((article) => {
      const articleInstance = new Article(
        article.title,
        article.content,
        article.writer,
        article.likeCount,
      );
      articles.push(articleInstance);
    });

    console.log('생성된 Article 인스턴스 목록:', articles);
    return articles;
  } catch (error) {
    console.error('게시글 인스턴스 생성 중 오류 발생:', error);
  }
}

// 작업 2: Product 서비스 함수 테스트
async function testProductService() {
  console.log('=== Product 서비스 테스트 시작 ===');

  try {
    // 상품 리스트 조회 테스트
    console.log('1. 상품 리스트 조회 테스트:');
    const productList = await getProductList(1, 5, '');
    console.log('상품 리스트:', productList);

    // 새 상품 생성 테스트
    console.log('2. 상품 생성 테스트:');
    const newProductData = {
      name: '테스트 상품',
      description: '테스트용 상품입니다.',
      price: 10000,
      tags: ['테스트', '샘플'],
      images: ['https://example.com/image1.jpg'],
    };

    const createdProduct = await createProduct(newProductData);
    console.log('생성된 상품:', createdProduct);

    // getter/setter 테스트
    console.log('3. 클래스 getter/setter 테스트:');
    const testProduct = new Product(
      '테스트 상품',
      '설명',
      1000,
      ['tag1'],
      ['image1.jpg'],
    );
    console.log('상품명:', testProduct.name);

    // favorite 메서드 테스트
    console.log('찜하기 전:', testProduct.favoriteCount);
    testProduct.favorite();
    console.log('찜하기 후:', testProduct.favoriteCount);
  } catch (error) {
    console.error('Product 서비스 테스트 중 오류:', error);
  }
}

// 작업 2: Article 서비스 함수 테스트
function testArticleService() {
  console.log('=== Article 서비스 테스트 시작 ===');

  // 게시글 리스트 조회 테스트
  console.log('1. 게시글 리스트 조회 테스트:');
  getArticleList(1, 10, '')
    .then((data) => {
      console.log('Article 리스트:', data);
    })
    .catch((error) => {
      console.error('Article 리스트 가져오기 실패:', error);
    });

  // 새 게시글 생성 테스트
  console.log('2. 게시글 생성 테스트:');
  const newArticleData = {
    title: '테스트 게시글',
    content: '이것은 테스트 내용입니다.',
    image: 'https://example.com/image.jpg',
  };

  createArticle(newArticleData)
    .then((data) => {
      console.log('Article 생성 성공:', data);
    })
    .catch((error) => {
      console.error('Article 생성 실패:', error);
    });

  // Article 클래스 getter/setter 테스트
  console.log('3. Article 클래스 getter/setter 테스트:');
  const testArticle = new Article('테스트 제목', '테스트 내용', '작성자');
  console.log('제목:', testArticle.title);
  console.log('작성자:', testArticle.writer);
  console.log('생성일:', testArticle.createdAt);

  // like 메서드 테스트
  console.log('좋아요 전:', testArticle.likeCount);
  testArticle.like();
  console.log('좋아요 후:', testArticle.likeCount);
}

// 실행
async function main() {
  // 인스턴스 생성
  await createProductInstances();
  await createArticleInstances();

  // 서비스 테스트
  await testProductService();
  testArticleService();
}

main();
