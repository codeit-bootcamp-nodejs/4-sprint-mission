import { getProductList, getProduct, createProduct, patchProduct, deleteProduct } from "./ProductService.js";
import { getArticleList, getArticle, createArticle, patchArticle, deleteArticle } from "./ArticleService.js";
import { Product, ElectronicProduct } from "./Product.js";

const productsList = await getProductList({});


const products = [];
const electronicProducts = [];

productsList.list.forEach((product) => {
  if (product.tags.includes("전자제품")) {
    electronicProducts.push(new ElectronicProduct(product));
  } else {
    products.push(new Product(product));
  }
});


// TEST ArticleService.js 
// 1. getArticleList

const articleList = await getArticleList({});
console.log(articleList);

// 2. createArticle
const newArticle = await createArticle({
  title: "위저드 베이커리",
  content: "선택에 관하여...",
  image: "http://image.jpg"
});
console.log(newArticle);

// 3. getArticle
const article2 = await getArticle(newArticle.id);
console.log(article2);

// 4. patchArticle
const updatedArticle = await patchArticle(article2.id, {
  title: "Weizsard Bakery",
  content: "이것은 수정된 글입니다.",
  image: "http://updated_image.jpg"
});
console.log(updatedArticle);

// 5. deleteArticle
const articleDelete = await deleteArticle(updatedArticle.id);
console.log(articleDelete);

// TEST ProductService.js
// 1. createProduct
const newProduct = await createProduct({
  name: "고구마 3kg",
  description: "해남 산지 직송 고구마 3kg",
  price: 20000,
  tags : ["식품", "고구마"],
  images: ["http://product_image.jpg"]
});
console.log(newProduct);

// 2. getProduct
const product1 = await getProduct(newProduct.id);
console.log(product1);

// 3. patchProduct
const updatedProduct = await patchProduct(newProduct.id, {
  name: "고구마 5kg",
  description: "이것은 수정된 제품입니다.",
  price: 30000,
  tags: ["식품", "수정"],
  images: ["http://updated_product_image.jpg"]
});
console.log(updatedProduct);

// 4. deleteProduct

const productDelete = await deleteProduct(updatedProduct.id);
console.log(productDelete);

