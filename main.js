import * as article from './src/ArticleService.js';
import * as product from './src/ProductService.js';

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