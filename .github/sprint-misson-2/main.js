import { Product, ElectronicProduct, Article } from './Classes.js';
import { getProductList, getProduct, createProduct, patchProduct, deleteProduct } from './ProductService.js';
import { getArticleList, getArticle, createArticle, patchArticle, deleteArticle } from './ArticleService.js';

async function loadProducts() {
const response = await getProductList({ page: 1, pageSize: 10 });
const products = [];
if (response && response.data) {
for (const item of response.data) {
if (item.tags && item.tags.includes('전자제품')) {
products.push(new ElectronicProduct(item.name, item.description, item.price, item.tags, item.images, item.manufacturer || ''));
} else {
products.push(new Product(item.name, item.description, item.price, item.tags, item.images));
}
}
}
console.log('만들어진 상품 인스턴스 배열:', products);
return products;
}

function testArticleService() {
getArticleList({ page: 1, pageSize: 3, keyword: '' }).then(console.log);
getArticle(1).then(console.log);
createArticle({ title: '테스트', content: '내용입니다', image: '' }).then(console.log);
patchArticle(1, { title: '수정', content: '수정된 내용', image: '' }).then(console.log);
deleteArticle(2).then(console.log);
}

async function testProductService() {
console.log(await getProductList({ page: 1, pageSize: 3, keyword: '' }));
console.log(await getProduct(1));
console.log(await createProduct({
name: '테스트 상품',
description: '테스트 설명',
price: 10000,
tags: ['테스트'],
images: [''],
}));
console.log(await patchProduct(1, {
name: '수정상품',
description: '수정 설명',
price: 13000,
tags: ['수정'],
images: [''],
}));
console.log(await deleteProduct(1));
}

loadProducts();
testArticleService();
testProductService();