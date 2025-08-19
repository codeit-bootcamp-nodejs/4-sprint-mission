import * as article from './sprintmission/src/ArticleService.js';
import * as product from './sprintmission/src/ProductService.js';

article.getArticleList();
article.getArticle();
article.createArticle();
article.patchArticle();
article.deleteArticle();

product.getProductList();
product.getProduct();
product.createProduct();
product.patchProduct();
product.deleteProduct();