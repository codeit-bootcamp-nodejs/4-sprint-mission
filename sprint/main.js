import {
  getArticleList,
  getArticle,
  createArticle,
  patchArticle,
  deleteArticle,
} from "./ApiService/ArticleService.js";
import {
  getProductList,
  getProduct,
  createProduct,
  patchProduct,
  deleteProduct,
  loadProducts,
} from "./ApiService/ProductService.js";

getArticleList(1, 10, "");
getArticle(1802);
createArticle({
  title: "기사제목",
  content: "기사내용",
  image: "https://example.com/...",
});
patchArticle(1877, {
  title: "기사제목2",
  content: "기사내용2",
});
deleteArticle(1877);
getProductList(1, 5, "");
getProduct(1331);
createProduct({
  name: "S30",
  description: "삼성",
  price: 10000,
  tags: ["전자제품"],
  images: [],
});
patchProduct(1374, {
  name: "iphone18",
  description: "apple",
});
deleteProduct(1374);
loadProducts(1, 10, "");
