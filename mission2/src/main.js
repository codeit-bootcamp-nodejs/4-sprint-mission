//Article ---

 import { getArticleList, getArticle, createArticle, patchArticle,  deleteArticle } from './ArticleService.js';

 //getArticleList
 const data1 = await getArticleList('page', 'pageSize', 'keyword');
 console.log(data1);

 //getArticle
 const data2 = await getArticle();
 console.log(data2);

 //createArticle
 const articleData = {
     title: '게시글 작성 테스트12345',
     content: '게시글 작성 테스트입니다.',
     image: 'https://example.com/...',
 };

 const data3 = await createArticle(articleData);
 console.log(data3);

//patchArticle
let article = await createArticle({
    title: '게시글 작성 테스트3',
    content: '게시글 작성 테스트입니다.',
    image: 'https://example.com/...',
});

console.log(article);

article = await patchArticle(article.id, {
    title: '게시글 작성 테테스트',
    content: '게시글 작성 테스트중입니다.',
    image: 'https://example.com/...',
});

console.log(article);

//deleteArticle
await deleteArticle(article.id);

// 비동기 처리, 오류 처리
fetch(`https://panda-market-api-crud.vercel.app/docs/articles`)
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.log('Error!'))
  .finally(() => console.log('Finished'));

// async function getArticle() {
//     const response = await fetch(`https://panda-market-api-crud.vercel.app/articles`);
//     const data = await response.json();
//     console.log(nodpe data);
// };

fetch(`https://panda-market-api-crud.vercel.app/articles`)
  .then((response) => response.json())
  .then((data) => console.log(data));

console.log('게시물을 불러내고 있습니다...');


// //Product---

// import { getProductList, getProduct, createProduct, patchProduct, deleteProduct, checkProduct } from "./ProductServicejs";

// //getProductList
// const data4 = await getProductList('page', 'pageSize', 'keyword');
// console.log(data4);

// //getProduct
// const data5 = await getProduct();
// console.log(data5);

// //createdProduct
// const productData = {
//     name: '디지몬 피규어',
//     description: '가슴이 웅장해지는 오메가몬',
//     price: 80000,
//     tags: '장식',
//     images: "https://example.com/...",
// };

// const data6 = await createProduct(productData);
// console.log(data6);

// //patchProduct
// let products = await createProduct({
//     name: '디지몬 피규어',
//     description: '가슴이 웅장해지는 오메가몬',
//     price: 80000,
//     tags: '장식',
//     images: "https://example.com/...",
// });

// console.log(products);

// const product = await patchProduct(id, {
//     name: '디지털 몬스터',
//     description: '어린 시절 모두가 했었던 다마고치',
//     price: 40000,
//     tags: '전자제품',
//     images: "https://example.com/...",
// });

// console.log(product);

// //deleteProduct
// await deleteProduct(1258);

// //비동기 처리, 오류 처리
// import { checkProduct } from "./ProductService.js";

// try {
//     const data = await checkProduct(id);
//     console.log(data);
// } catch (e) {
//     console.log(`오류가 발생했습니다.`)
//     console.log(e.message);
// }

// //해시태그 '전자제품' 분리
// function addNewProduct(products) {
//   const { name, description, price, tags, images, favoriteCount } = product;
//   const newProduct = {
//     id: products.length + 1,
//     name,
//     description,
//     price,
//     tags,
//     images,
//     favoriteCount,
//   };
//   productsInput.push(newProduct);
// }

// const productsInput = await getProduct();

// console.log(productsInput);

// const products = productsInput;

// console.log(products);

// const electronicProduct = [];

// // productsInput.list.forEach((product) => {
// //   if(product.tags.find((element) => element === '전자제품')) {
// //     electronicProduct.push(product);
// //   }
// // });

// // console.log(electronicProduct);

// productsInput.list.forEach((product) => {
//   if(product.tags.includes('전자제품')) {
//     electronicProduct.push(product);
//   }
// });

// console.log(electronicProduct);