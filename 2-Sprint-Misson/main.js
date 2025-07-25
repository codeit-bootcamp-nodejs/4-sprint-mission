import { Product, ElectronicProduct, ProductService } from './ProductService.js';
import { Article, ArticleService } from './ArticleService.js';

const run = async () => {
  try {
    const articleService = new ArticleService();       // ✅ 인스턴스 생성
    const productService = new ProductService();       // ✅ 인스턴스 생성

    console.log("=== Article 목록 ===");
    const articles = await articleService.getArticleList({ page: 1, pageSize: 5 }); // ✅ 인스턴스 메서드 호출
    console.log(articles);

    console.log("\n=== Product 목록 ===");
    const products = await productService.getProductList({ page: 1, pageSize: 5 }); // ✅ 인스턴스 메서드 호출
    console.log(products);

    console.log("\n=== 전자제품만 추출 ===");
    const electronics = products.filter(p => p instanceof ElectronicProduct);
    console.log(electronics);

  } catch (err) {
    console.error("실행 중 오류:", err.message);
  }
};

run();
