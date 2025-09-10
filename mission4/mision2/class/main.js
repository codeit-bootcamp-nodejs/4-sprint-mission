// 클래스 import
import {Product} from './Product.js';
import ElectronicProduct from './ElectronicProduct.js';

// 서비스 함수들 import
import {
  getProductList,
  getProduct,
  createProduct,
  patchProduct,
  deleteProduct
} from './ProductService.js';

import {
  getArticleList,
  getArticle,
  createArticle,
  patchArticle,
  deleteArticle
} from './ArticleService.js';


// 작업 1
const products = [];

async function loadProducts() {
  const data = await getProductList(1, 20, '');

  if (data && data.data) {
    data.data.forEach((item) => {
      const { name, description, price, tags, images } = item;

      if (tags.includes('전자제품')) {
        const electronic = new ElectronicProduct(name, description, price, tags, images, '미상');
        products.push(electronic);
      } else {
        const product = new Product(name, description, price, tags, images);
        products.push(product);
      }
    });

    console.log('생성된 상품 인스턴스 목록:', products);
  } else {
    console.warn('상품 데이터를 불러올 수 없습니다.');
  }
}


// 작업 2

async function testServices() {
  console.log('[Article] createArticle 테스트');
  const newArticle = await createArticle({
    title: '테스트 글',
    content: '이것은 테스트용 콘텐츠입니다.',
    image: 'https://via.placeholder.com/150'
  });
  console.log(newArticle);

  if (newArticle?.id) {
    console.log('[Article] getArticle 테스트');
    const foundArticle = await getArticle(newArticle.id);
    console.log(foundArticle);

    console.log('[Article] patchArticle 테스트');
    const updatedArticle = await patchArticle(newArticle.id, {
      title: '수정된 제목',
      content: '수정된 콘텐츠',
      image: 'https://via.placeholder.com/200'
    });
    console.log(updatedArticle);

    console.log('[Article] deleteArticle 테스트');
    const deletedArticle = await deleteArticle(newArticle.id);
    console.log(deletedArticle);
  }

  console.log('[Product] createProduct 테스트');
  const newProduct = await createProduct({
    name: '테스트 상품',
    description: '이 상품은 테스트용입니다.',
    price: 9999,
    tags: ['테스트', '전자제품'],
    images: ['https://via.placeholder.com/150']
  });
  console.log(newProduct);

  if (newProduct?.id) {
    console.log('[Product] getProduct 테스트');
    const foundProduct = await getProduct(newProduct.id);
    console.log(foundProduct);

    console.log('[Product] patchProduct 테스트');
    const updatedProduct = await patchProduct(newProduct.id, {
      name: '수정된 상품명',
      description: '설명이 수정되었습니다.',
      price: 8888,
      tags: ['수정됨'],
      images: ['https://via.placeholder.com/200']
    });
    console.log(updatedProduct);

    console.log('[Product] deleteProduct 테스트');
    const deletedProduct = await deleteProduct(newProduct.id);
    console.log(deletedProduct);
  }
}

loadProducts();
testServices();
