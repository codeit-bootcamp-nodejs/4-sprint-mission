import *as productService from './ProductService.js';
import *as articleService from './ArticleService.js';

async function main() {

    console.log('=====getProductList() 테스트=====');
    await productService.getProductList(1, 2); // page, pageSize, keyword, orderBy = 'recent'

    console.log('=====getProduct() 테스트=====');
    await productService.getProduct(1274); // productId = undefined

    console.log('=====createProduct() 테스트=====');
    await productService.createProduct("상품이름", "상품설명", 10, ["전자제품"], ["https://example.com/..."]); // name, description, price, tags, images

    console.log('=====patchProduct() 테스트=====');
    await productService.patchProduct("상품이름", "상품설명", 10, ["제품"], ["https://example.com/..."], 1280); // name, description, price, tags, images, productId = undefined

    console.log('=====deleteProduct() 테스트=====');
    await productService.deleteProduct(1275); // productId = undefined

    await console.log('=====getArticleList() 테스트=====');
    await articleService.getArticleList(1, 1) // page, pageSize, keyword, orderBy = 'recent'

    await console.log('=====getArticle() 테스트====='); // articleId = undefined
    await articleService.getArticle(1733);

    await console.log('=====createArticle() 테스트=====');
    await articleService.createArticle("기사제목", "기사내용", "https://example.com/...") // title, content, image

    await console.log('=====patchArticle() 테스트=====');
    await articleService.patchArticle("기사제목", "기사내용", "https://example.com/...", 1733) // title, content, image, articleId = undefined

    await console.log('=====deleteArticle() 테스트=====');
    await articleService.deleteArticle(1717)// articleId = undefined)
}

main();