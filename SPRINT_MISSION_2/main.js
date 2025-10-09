import { Product, ElectronicProduct } from './Product.js';
import { getProductList } from './ProductService.js';
import {
  getArticleList,
  getArticle,
  createArticle,
  patchArticle,
  deleteArticle
} from './ArticleService.js';

const products = [];

getProductList(1, 20, '').then(data => {
  if (data && data.data) {
    for (const item of data.data) {
      if (item.tags.includes('전자제품')) {
        products.push(new ElectronicProduct(item.name, item.description, item.price, item.tags, item.images, item.manufacturer || 'Unknown'));
      } else {
        products.push(new Product(item.name, item.description, item.price, item.tags, item.images));
      }
    }
    console.log('Products:', products);
  }
});

getArticleList(1, 5).then(res => console.log('Article List:', res));
createArticle('제목 테스트', '내용 테스트입니다.', 'https://example.com/image.jpg').then(res => console.log('Created:', res));